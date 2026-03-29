import Anthropic from '@anthropic-ai/sdk';
import { JiraClient } from './jira';
import { AgentError, AicmaTask, JiraConfig } from './types';
import { buildTaskSystemPrompt, buildTaskUserPrompt } from './task-prompts';

const TOOLS: Anthropic.Tool[] = [
  {
    name: 'create_aicma_task',
    description: 'Cria uma Tarefa no Jira com estrutura AICMA completa na descrição.',
    input_schema: {
      type: 'object' as const,
      properties: {
        title: { type: 'string', description: 'Título da task (sem o project_tag)' },
        project_tag: { type: 'string', description: 'Tag do projeto, ex: CELCOIN-Sandbox, NEXORA-API' },
        intencao: { type: 'string', description: 'Parágrafo de intenção (Intenção I)' },
        conteudo: { type: 'array', items: { type: 'string' }, description: 'Bullets do conteúdo (C)' },
        motivo: { type: 'string', description: 'Parágrafo de motivo (M)' },
        acoes: { type: 'array', items: { type: 'string' }, description: 'Bullets das ações (A)' },
        requisitos_funcionais: {
          type: 'array',
          items: { type: 'string' },
          description: 'RF01: ..., RF02: ...',
        },
        requisitos_nao_funcionais: {
          type: 'array',
          items: { type: 'string' },
          description: 'RNF01: ..., RNF02: ...',
        },
        notas_tecnicas: { type: 'array', items: { type: 'string' } },
        criterios_aceite: { type: 'array', items: { type: 'string' } },
        steps_implementacao: {
          type: 'array',
          items: { type: 'string' },
          description: 'Steps numerados',
        },
        pr_suggestion: { type: 'string', description: '[PROJECT-TAG] Título do PR' },
        commit_suggestion: { type: 'string', description: 'tipo(escopo): mensagem' },
        epic_jira_key: {
          type: 'string',
          description: 'Chave Jira do épico pai (opcional, ex: BIT-1)',
        },
      },
      required: [
        'title', 'project_tag', 'intencao', 'conteudo', 'motivo', 'acoes',
        'requisitos_funcionais', 'requisitos_nao_funcionais', 'notas_tecnicas',
        'criterios_aceite', 'steps_implementacao', 'pr_suggestion', 'commit_suggestion',
      ],
    },
  },
];

export class JiraTaskAgent {
  private client: Anthropic;
  private jira: JiraClient;

  constructor(apiKey: string, jiraConfig: JiraConfig) {
    this.client = new Anthropic({ apiKey });
    this.jira = new JiraClient(jiraConfig);
  }

  async run(taskDescription: string, epicKey?: string): Promise<void> {
    const messages: Anthropic.MessageParam[] = [
      { role: 'user', content: buildTaskUserPrompt(taskDescription) },
    ];

    while (true) {
      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        system: buildTaskSystemPrompt(),
        tools: TOOLS,
        messages,
      });

      for (const block of response.content) {
        if (block.type === 'text') {
          process.stdout.write(block.text);
        }
      }

      if (response.stop_reason === 'end_turn') {
        process.stdout.write('\n');
        break;
      }

      if (response.stop_reason !== 'tool_use') break;

      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const block of response.content) {
        if (block.type !== 'tool_use') continue;

        const input = block.input as Record<string, unknown>;
        let result: string;

        try {
          const task: AicmaTask = {
            title: input.title as string,
            projectTag: input.project_tag as string,
            intencao: input.intencao as string,
            conteudo: (input.conteudo as string[]) ?? [],
            motivo: input.motivo as string,
            acoes: (input.acoes as string[]) ?? [],
            requisitosFuncionais: (input.requisitos_funcionais as string[]) ?? [],
            requisitosNaoFuncionais: (input.requisitos_nao_funcionais as string[]) ?? [],
            notasTecnicas: (input.notas_tecnicas as string[]) ?? [],
            criteriosAceite: (input.criterios_aceite as string[]) ?? [],
            stepsImplementacao: (input.steps_implementacao as string[]) ?? [],
            prSuggestion: input.pr_suggestion as string,
            commitSuggestion: input.commit_suggestion as string,
          };

          const parentKey = (input.epic_jira_key as string | undefined) ?? epicKey;
          const created = await this.jira.createTaskFromAicma(task, parentKey);

          process.stderr.write(`\n  ✓ Tarefa criada: ${created.jiraKey}  ${created.url}\n`);
          result = JSON.stringify({ jira_key: created.jiraKey, url: created.url });
        } catch (err) {
          const msg = err instanceof AgentError ? err.message : String(err);
          process.stderr.write(`  ✗ create_aicma_task failed: ${msg}\n`);
          result = JSON.stringify({ error: msg });
        }

        toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: result });
      }

      messages.push({ role: 'assistant', content: response.content });
      messages.push({ role: 'user', content: toolResults });
    }
  }
}
