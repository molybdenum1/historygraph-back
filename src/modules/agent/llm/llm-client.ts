export const LLM_CLIENT = Symbol("LLM_CLIENT");

export interface GenerateJsonOptions {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LlmClient {
  generateJson(options: GenerateJsonOptions): Promise<string>;
}
