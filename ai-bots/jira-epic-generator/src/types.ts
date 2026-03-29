export interface GeneratorOptions {
  projectDescription: string;
  outputPath: string;
}

export interface EpicGeneratorResult {
  outputPath: string;
  epicCount: number;
  storyCount: number;
  durationMs: number;
}

export interface JiraStory {
  localKey: string;   // US-001
  title: string;      // "Como desenvolvedor, quero..."
  criteria: string[]; // acceptance criteria items
}

export interface JiraEpic {
  localKey: string;   // EPIC-01
  name: string;       // "Foundation & Platform"
  objective: string;  // "preparar repositório..."
  stories: JiraStory[];
}

export interface JiraConfig {
  baseUrl: string;
  email: string;
  token: string;
  projectKey: string;
}

export interface AicmaTask {
  title: string;
  projectTag: string;
  intencao: string;
  conteudo: string[];
  motivo: string;
  acoes: string[];
  requisitosFuncionais: string[];
  requisitosNaoFuncionais: string[];
  notasTecnicas: string[];
  criteriosAceite: string[];
  stepsImplementacao: string[];
  prSuggestion: string;
  commitSuggestion: string;
}

export class AgentError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'AgentError';
  }
}
