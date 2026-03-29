import { AgentError, AicmaTask, JiraConfig, JiraEpic, JiraStory } from './types';

interface AdfNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: AdfNode[];
  text?: string;
  marks?: Array<{ type: string }>;
}

function adfDoc(...content: AdfNode[]): object {
  return { version: 1, type: 'doc', content };
}

function adfParagraph(text: string): AdfNode {
  return { type: 'paragraph', content: [{ type: 'text', text }] };
}

function adfBulletList(items: string[]): AdfNode {
  return {
    type: 'bulletList',
    content: items.map((item) => ({
      type: 'listItem',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: item }] }],
    })),
  };
}

function adfOrderedList(items: string[]): AdfNode {
  return {
    type: 'orderedList',
    content: items.map((item) => ({
      type: 'listItem',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: item }] }],
    })),
  };
}

function adfCodeBlock(text: string): AdfNode {
  return { type: 'codeBlock', attrs: {}, content: [{ type: 'text', text }] };
}

function adfHeading(text: string, level: number): AdfNode {
  return {
    type: 'heading',
    attrs: { level },
    content: [{ type: 'text', text }],
  };
}

export interface CreatedIssue {
  localKey: string;
  jiraKey: string;
  url: string;
}

export class JiraClient {
  private baseUrl: string;
  private authHeader: string;
  private projectKey: string;

  constructor(config: JiraConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.authHeader =
      'Basic ' + Buffer.from(`${config.email}:${config.token}`).toString('base64');
    this.projectKey = config.projectKey;
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}/rest/api/3${path}`;
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: this.authHeader,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();

    if (!res.ok) {
      throw new AgentError(
        `Jira API ${method} ${path} failed [${res.status}]: ${text}`,
      );
    }

    return text ? (JSON.parse(text) as T) : ({} as T);
  }

  async createEpic(epic: JiraEpic): Promise<CreatedIssue> {
    const description = adfDoc(
      adfParagraph(`Objetivo: ${epic.objective}`),
    );

    const body = {
      fields: {
        project: { key: this.projectKey },
        summary: `${epic.localKey} — ${epic.name}`,
        issuetype: { name: 'Epic' },
        description,
      },
    };

    const res = await this.request<{ key: string; self: string }>('POST', '/issue', body);
    return {
      localKey: epic.localKey,
      jiraKey: res.key,
      url: `${this.baseUrl}/browse/${res.key}`,
    };
  }

  async createStory(story: JiraStory, epicJiraKey: string): Promise<CreatedIssue> {
    const descContent: AdfNode[] = [];

    if (story.criteria.length > 0) {
      descContent.push(adfHeading('Critérios de aceite', 3));
      descContent.push(adfBulletList(story.criteria));
    }

    const description = adfDoc(...descContent);

    const body = {
      fields: {
        project: { key: this.projectKey },
        summary: `${story.localKey} — ${story.title}`,
        issuetype: { name: 'Story' },
        parent: { key: epicJiraKey },
        description,
      },
    };

    const res = await this.request<{ key: string; self: string }>('POST', '/issue', body);
    return {
      localKey: story.localKey,
      jiraKey: res.key,
      url: `${this.baseUrl}/browse/${res.key}`,
    };
  }

  async createEpicFromTool(localKey: string, name: string, objective: string): Promise<CreatedIssue> {
    const description = adfDoc(adfParagraph(`Objetivo: ${objective}`));
    const body = {
      fields: {
        project: { key: this.projectKey },
        summary: `${localKey} — ${name}`,
        issuetype: { name: 'Epic' },
        description,
      },
    };
    const res = await this.request<{ key: string }>('POST', '/issue', body);
    return { localKey, jiraKey: res.key, url: `${this.baseUrl}/browse/${res.key}` };
  }

  async createStoryFromTool(
    localKey: string,
    epicJiraKey: string,
    title: string,
    criteria: string[],
  ): Promise<CreatedIssue> {
    const descContent: AdfNode[] = criteria.length
      ? [adfHeading('Critérios de aceite', 3), adfBulletList(criteria)]
      : [];

    const body = {
      fields: {
        project: { key: this.projectKey },
        summary: `${localKey} — ${title}`,
        issuetype: { name: 'Story' },
        parent: { key: epicJiraKey },
        description: adfDoc(...descContent),
      },
    };
    const res = await this.request<{ key: string }>('POST', '/issue', body);
    return { localKey, jiraKey: res.key, url: `${this.baseUrl}/browse/${res.key}` };
  }

  async pushBacklog(
    epics: JiraEpic[],
    onProgress: (msg: string) => void,
  ): Promise<CreatedIssue[]> {
    const created: CreatedIssue[] = [];

    for (const epic of epics) {
      onProgress(`  Creating epic  ${epic.localKey} — ${epic.name}`);
      const createdEpic = await this.createEpic(epic);
      onProgress(`  ✓ ${createdEpic.jiraKey}  ${createdEpic.url}`);
      created.push(createdEpic);

      for (const story of epic.stories) {
        onProgress(`    Creating story  ${story.localKey} — ${story.title.slice(0, 60)}...`);
        const createdStory = await this.createStory(story, createdEpic.jiraKey);
        onProgress(`    ✓ ${createdStory.jiraKey}  ${createdStory.url}`);
        created.push(createdStory);
      }
    }

    return created;
  }

  async createTaskFromAicma(task: AicmaTask, epicKey?: string): Promise<CreatedIssue> {
    const summary = `[${task.projectTag}] ${task.title}`;

    const desc = adfDoc(
      // Intenção (I)
      adfHeading('Intenção (I)', 2),
      adfParagraph(task.intencao),

      // Conteúdo (C)
      adfHeading('Conteúdo (C)', 2),
      adfBulletList(task.conteudo),

      // Motivo (M)
      adfHeading('Motivo (M)', 2),
      adfParagraph(task.motivo),

      // Ação (A)
      adfHeading('Ação (A)', 2),
      adfBulletList(task.acoes),

      // Requisitos Funcionais
      adfHeading('Requisitos Funcionais (RF)', 2),
      adfBulletList(task.requisitosFuncionais),

      // Requisitos Não Funcionais
      adfHeading('Requisitos Não Funcionais (RNF)', 2),
      adfBulletList(task.requisitosNaoFuncionais),

      // Notas Técnicas
      adfHeading('Notas Técnicas', 2),
      adfBulletList(task.notasTecnicas),

      // Critérios de Aceite
      adfHeading('Critérios de Aceite', 2),
      adfBulletList(task.criteriosAceite),

      // Steps de Implementação
      adfHeading('Steps de Implementação', 2),
      adfOrderedList(task.stepsImplementacao),

      // Sugestão de PR
      adfHeading('Sugestão de PR', 2),
      adfCodeBlock(task.prSuggestion),

      // Commit semântico
      adfHeading('Commit semântico sugerido', 2),
      adfCodeBlock(task.commitSuggestion),
    );

    const fields: Record<string, unknown> = {
      project: { key: this.projectKey },
      summary,
      issuetype: { name: 'Tarefa' },
      description: desc,
    };

    if (epicKey) fields.parent = { key: epicKey };

    const res = await this.request<{ key: string }>('POST', '/issue', { fields });
    return { localKey: task.title, jiraKey: res.key, url: `${this.baseUrl}/browse/${res.key}` };
  }
}
