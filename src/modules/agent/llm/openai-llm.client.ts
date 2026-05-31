import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from "@nestjs/common";
import OpenAI from "openai";
import {
  AgentProviderQuotaException,
  AgentProviderRateLimitException,
} from "../errors/agent.errors";
import { GenerateJsonOptions, LlmClient } from "./llm-client";

@Injectable()
export class OpenAiLlmClient implements LlmClient {
  private readonly logger = new Logger(OpenAiLlmClient.name);
  private readonly client: OpenAI;
  private readonly model: string;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      this.logger.warn("OPENAI_API_KEY is not configured");
    }

    this.client = new OpenAI({ apiKey: apiKey ?? "missing-api-key" });
    this.model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
  }

  async generateJson(options: GenerateJsonOptions): Promise<string> {
    if (!process.env.OPENAI_API_KEY) {
      throw new ServiceUnavailableException("OpenAI API key is not configured");
    }

    const response = await this.createChatCompletion(options);

    const content = response.choices[0]?.message.content;

    if (!content) {
      throw new ServiceUnavailableException(
        "OpenAI returned an empty response",
      );
    }

    return content;
  }

  private async createChatCompletion(options: GenerateJsonOptions) {
    try {
      return await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "system",
            content:
              "You return valid JSON only. Your output must be parseable by JSON.parse.",
          },
          { role: "user", content: options.prompt },
        ],
        response_format: { type: "json_object" },
        temperature: options.temperature ?? 0.2,
        max_tokens: options.maxTokens ?? 2500,
      });
    } catch (error) {
      if (this.isQuotaExceededError(error)) {
        this.logger.error("OpenAI quota exceeded");
        throw new AgentProviderQuotaException();
      }

      if (this.isRateLimitError(error)) {
        this.logger.warn("OpenAI rate limit exceeded");
        throw new AgentProviderRateLimitException();
      }

      throw error;
    }
  }

  private isQuotaExceededError(error: unknown): boolean {
    if (!this.isOpenAiStatusError(error)) {
      return false;
    }

    const responseBody = this.getOpenAiErrorBody(error);
    return Boolean(
      error.status === 429 &&
        (responseBody?.error?.code === "insufficient_quota" ||
          responseBody?.error?.type === "insufficient_quota" ||
          responseBody?.error?.message
            ?.toLowerCase()
            .includes("exceeded your current quota")),
    );
  }

  private isRateLimitError(error: unknown): boolean {
    return this.isOpenAiStatusError(error) && error.status === 429;
  }

  private isOpenAiStatusError(
    error: unknown,
  ): error is OpenAiStatusError {
    return error instanceof OpenAI.APIError && typeof error.status === "number";
  }

  private getOpenAiErrorBody(
    error: OpenAiStatusError,
  ): { error?: { code?: string; type?: string; message?: string } } | undefined {
    return error.error as
      | { error?: { code?: string; type?: string; message?: string } }
      | undefined;
  }
}

interface OpenAiStatusError {
  status: number;
  error: unknown;
}
