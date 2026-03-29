import Anthropic from '@anthropic-ai/sdk';
import { JiraClient } from './jira';
import { AgentError, JiraConfig } from './types';
import { buildSystemPrompt, buildUserPrompt } from './prompts';

const TOOLS: Anthropic.Tool[] = [
  {
    name: 'create_epic',
    description: 'Cria um épico no Jira e retorna a chave do issue criado.',
    input_schema: {
      type: 'object' as const,
      properties: {
        local_key: { type: 'string', description: 'Chave local do épico: EPIC-01, EPIC-02...' },
        name: { type: 'string', description: 'Nome do épico' },
        objective: { type: 'string', description: 'Objetivo em uma linha' },
      },
      required: ['local_key', 'name', 'objective'],
    },
  },
  {
    name: 'create_story',
    description: 'Cria uma história de usuário no Jira vinculada a um épico.',
    input_schema: {
      type: 'object' as const,
      properties: {
        local_key: { type: 'string', description: 'Chave local da story: US-001, US-002...' },
        epic_jira_key: {
          type: 'string',
          description: 'Chave Jira do épico pai retornada por create_epic (ex: BIT-1)',
        },
        title: {
          type: 'string',
          description: 'Título da story: Como [persona], quero [ação], para [benefício]',
        },
        criteria: {
          type: 'array',
          items: { type: 'string' },
          description: 'Lista de critérios de aceite',
        },
      },
      required: ['local_key', 'epic_jira_key', 'title', 'criteria'],
    },
  },
];

export class JiraEpicAgent {
  private client: Anthropic;
  private jira: JiraClient;

  constructor(apiKey: string, jiraConfig: JiraConfig) {
    this.client = new Anthropic({ apiKey });
    this.jira = new JiraClient(jiraConfig);
  }

  async run(projectDescription: string): Promise<void> {
    const messages: Anthropic.MessageParam[] = [
      { role: 'user', content: buildUserPrompt(projectDescription) },
    ];

    // Agentic loop: keep calling Claude until it stops using tools
    while (true) {
      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        system: buildSystemPrompt(),
        tools: TOOLS,
        messages,
      });

      // Print any text Claude outputs
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

      // Execute tool calls and collect results
      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const block of response.content) {
        if (block.type !== 'tool_use') continue;

        const input = block.input as Record<string, unknown>;
        let result: string;

        try {
          if (block.name === 'create_epic') {
            const created = await this.jira.createEpicFromTool(
              input.local_key as string,
              input.name as string,
              input.objective as string,
            );
            process.stderr.write(`  ✓ Epic  ${created.localKey} → ${created.jiraKey}  ${created.url}\n`);
            result = JSON.stringify({ jira_key: created.jiraKey, url: created.url });

          } else if (block.name === 'create_story') {
            const created = await this.jira.createStoryFromTool(
              input.local_key as string,
              input.epic_jira_key as string,
              input.title as string,
              (input.criteria as string[]) ?? [],
            );
            process.stderr.write(`    ✓ Story ${created.localKey} → ${created.jiraKey}  ${created.url}\n`);
            result = JSON.stringify({ jira_key: created.jiraKey, url: created.url });

          } else {
            result = JSON.stringify({ error: `Ferramenta desconhecida: ${block.name}` });
          }
        } catch (err) {
          const msg = err instanceof AgentError ? err.message : String(err);
          process.stderr.write(`  ✗ ${block.name} failed: ${msg}\n`);
          result = JSON.stringify({ error: msg });
        }

        toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: result });
      }

      // Append assistant turn + tool results and continue the loop
      messages.push({ role: 'assistant', content: response.content });
      messages.push({ role: 'user', content: toolResults });
    }
  }
}
