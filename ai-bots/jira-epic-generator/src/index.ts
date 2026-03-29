import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { JiraEpicAgent } from './agent';
import { AgentError, JiraConfig } from './types';

// ── Jira config ──────────────────────────────────────────────────────────────

function readJiraTokenFile(): { email?: string; token?: string } {
  const candidates = [
    path.resolve(__dirname, '../../.env.jira.token'),
    path.resolve(process.cwd(), '../.env.jira.token'),
    path.resolve(process.cwd(), '.env.jira.token'),
  ];

  for (const filePath of candidates) {
    if (!fs.existsSync(filePath)) continue;

    const result: { email?: string; token?: string } = {};
    for (const line of fs.readFileSync(filePath, 'utf-8').split('\n')) {
      const t = line.trim();
      if (t.startsWith('EMAIL:')) result.email = t.slice('EMAIL:'.length).trim();
      if (t.startsWith('TOKEN:')) result.token = t.slice('TOKEN:'.length).trim();
    }

    if (result.email && result.token) {
      process.stderr.write(`Jira credentials loaded from ${filePath}\n`);
      return result;
    }
  }

  return {};
}

function loadJiraConfig(): JiraConfig {
  const file = readJiraTokenFile();

  const baseUrl = process.env.JIRA_BASE_URL ?? 'https://bit4devs.atlassian.net';
  const email = process.env.JIRA_EMAIL ?? file.email;
  const token = process.env.JIRA_TOKEN ?? file.token;
  const projectKey = process.env.JIRA_PROJECT_KEY ?? 'BIT';

  if (!email || !token) {
    process.stderr.write('Error: Jira credentials not found.\n');
    process.stderr.write('Place a .env.jira.token file with EMAIL: and TOKEN: lines, or set JIRA_EMAIL and JIRA_TOKEN.\n');
    process.exit(1);
  }

  return { baseUrl, email, token, projectKey };
}

// ── Input ────────────────────────────────────────────────────────────────────

function parseArgs(): { description?: string; inputFile?: string } {
  const args = process.argv.slice(2);
  let description: string | undefined;
  let inputFile: string | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--description' && args[i + 1]) description = args[++i];
    else if (args[i] === '--input' && args[i + 1]) inputFile = args[++i];
  }

  return { description, inputFile };
}

async function readStdin(): Promise<string> {
  if (process.stdin.isTTY) return '';
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', (chunk) => (data += chunk));
    process.stdin.on('end', () => resolve(data.trim()));
  });
}

async function promptInteractive(): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stderr });
  return new Promise((resolve) => {
    rl.question('\nDescreva o projeto (o que deve ser construído): ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    process.stderr.write('Error: ANTHROPIC_API_KEY is not set.\n');
    process.exit(1);
  }

  const jiraConfig = loadJiraConfig();
  const { description: argDescription, inputFile } = parseArgs();

  let projectDescription: string | undefined = argDescription;

  if (!projectDescription && inputFile) {
    const fp = path.resolve(inputFile);
    if (!fs.existsSync(fp)) {
      process.stderr.write(`Error: Input file not found: ${fp}\n`);
      process.exit(1);
    }
    projectDescription = fs.readFileSync(fp, 'utf-8').trim();
  }

  if (!projectDescription) projectDescription = await readStdin();
  if (!projectDescription) projectDescription = await promptInteractive();

  if (!projectDescription) {
    process.stderr.write('Error: No project description provided.\n');
    process.exit(1);
  }

  process.stderr.write(`\nJira: ${jiraConfig.baseUrl}  project=${jiraConfig.projectKey}\n`);
  process.stderr.write('─'.repeat(60) + '\n');

  const agent = new JiraEpicAgent(apiKey, jiraConfig);

  try {
    await agent.run(projectDescription);
  } catch (err) {
    if (err instanceof AgentError) {
      process.stderr.write(`\nError: ${err.message}\n`);
    } else {
      process.stderr.write(`\nUnexpected error: ${err}\n`);
    }
    process.exit(1);
  }
}

main();
