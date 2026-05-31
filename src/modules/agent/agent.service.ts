import { HttpException, Inject, Injectable, Logger } from "@nestjs/common";
import { DraftsService } from "../drafts/drafts.service";
import { GeneratedHistoricalDraftResponseDto } from "./dto/generate-historical-draft.dto";
import {
  AgentJsonParseException,
  AgentValidationException,
} from "./errors/agent.errors";
import { LLM_CLIENT, LlmClient } from "./llm/llm-client";
import { buildHistoricalDraftPrompt } from "./prompts/historical-draft.prompt";
import {
  HistoricalDraft,
  historicalDraftSchema,
} from "./schemas/historical-draft.schema";

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);
  private readonly maxAttempts = 3;

  constructor(
    private readonly draftsService: DraftsService,
    @Inject(LLM_CLIENT) private readonly llmClient: LlmClient,
  ) {}

  async generateHistoricalDraft(
    topic: string,
  ): Promise<GeneratedHistoricalDraftResponseDto> {
    const prompt = buildHistoricalDraftPrompt(topic);
    const structuredDraft = await this.generateAndValidateWithRetry(
      topic,
      prompt,
    );

    const draft = await this.draftsService.create({
      topic,
      rawResponse: structuredDraft,
      status: "pending",
    });

    this.logger.log(`Saved historical draft ${draft.id} for topic "${topic}"`);

    return {
      draftId: draft.id,
      topic,
      ...structuredDraft,
    };
  }

  private async generateAndValidateWithRetry(
    topic: string,
    prompt: string,
  ): Promise<HistoricalDraft> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= this.maxAttempts; attempt += 1) {
      try {
        this.logger.log(
          `Generating historical draft for "${topic}" attempt ${attempt}/${this.maxAttempts}`,
        );

        const content = await this.llmClient.generateJson({
          prompt,
          temperature: 0.2,
          maxTokens: 2500,
        });

        return this.parseAndValidate(content);
      } catch (error) {
        lastError = error;

        if (!this.shouldRetry(error, attempt)) {
          throw error;
        }

        const delayMs = this.retryDelayMs(attempt);
        this.logger.warn(
          `Historical draft generation attempt ${attempt} failed; retrying in ${delayMs}ms`,
        );
        await this.sleep(delayMs);
      }
    }

    throw lastError;
  }

  private parseAndValidate(content: string): HistoricalDraft {
    let parsed: unknown;

    try {
      parsed = JSON.parse(content);
    } catch {
      throw new AgentJsonParseException();
    }

    const result = historicalDraftSchema.safeParse(parsed);

    if (!result.success) {
      throw new AgentValidationException(result.error);
    }

    return result.data;
  }

  private shouldRetry(error: unknown, attempt: number): boolean {
    if (attempt >= this.maxAttempts) {
      return false;
    }

    if (this.isNonRetryableProviderError(error)) {
      return false;
    }

    return true;
  }

  private isNonRetryableProviderError(error: unknown): boolean {
    if (!(error instanceof HttpException)) {
      return false;
    }

    const response = error.getResponse();

    if (
      typeof response === "string" &&
      response.includes("OpenAI API key is not configured")
    ) {
      return true;
    }

    return (
      typeof response === "object" &&
      response !== null &&
      "code" in response &&
      response.code === "LLM_PROVIDER_QUOTA_EXCEEDED"
    );
  }

  private retryDelayMs(attempt: number): number {
    return 500 * 2 ** (attempt - 1);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
