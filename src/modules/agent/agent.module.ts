import { Module } from "@nestjs/common";
import { DraftsModule } from "../drafts/drafts.module";
import { AgentController } from "./agent.controller";
import { AgentService } from "./agent.service";
import { LLM_CLIENT } from "./llm/llm-client";
import { OpenAiLlmClient } from "./llm/openai-llm.client";

@Module({
  imports: [DraftsModule],
  controllers: [AgentController],
  providers: [
    AgentService,
    {
      provide: LLM_CLIENT,
      useClass: OpenAiLlmClient,
    },
  ],
})
export class AgentModule {}
