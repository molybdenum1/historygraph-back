import {
  BadGatewayException,
  HttpException,
  HttpStatus,
  ServiceUnavailableException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { ZodError } from "zod";

export class AgentJsonParseException extends BadGatewayException {
  constructor() {
    super("LLM returned invalid JSON");
  }
}

export class AgentValidationException extends UnprocessableEntityException {
  constructor(error: ZodError) {
    super({
      message: "LLM response did not match the historical draft schema",
      issues: error.flatten(),
    });
  }
}

export class AgentProviderQuotaException extends ServiceUnavailableException {
  constructor() {
    super({
      message:
        "LLM provider quota exceeded. Check OpenAI plan, billing, and project limits.",
      code: "LLM_PROVIDER_QUOTA_EXCEEDED",
    });
  }
}

export class AgentProviderRateLimitException extends HttpException {
  constructor() {
    super(
      {
        message: "LLM provider rate limit exceeded. Retry shortly.",
        code: "LLM_PROVIDER_RATE_LIMITED",
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
