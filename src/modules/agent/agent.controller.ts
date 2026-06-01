import { Body, Controller, Get, Post } from "@nestjs/common";
import { ZodValidationPipe } from "../../common/validation/zod-validation.pipe";
import {
  GenerateHistoricalDraftDto,
  generateHistoricalDraftSchema,
} from "./dto/generate-historical-draft.dto";
import { AgentService } from "./agent.service";

@Controller("agent")
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post("generate")
  generateHistoricalDraft(
    @Body(new ZodValidationPipe(generateHistoricalDraftSchema))
    data: GenerateHistoricalDraftDto,
  ) {
    return this.agentService.generateHistoricalDraft(data.topic);
  }

  @Get("agent-ping")
  pingAgent() {
    return "Pong";
  }
}
