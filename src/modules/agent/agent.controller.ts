import { Body, Controller, Post } from '@nestjs/common';
import { ZodValidationPipe } from '../../common/validation/zod-validation.pipe';
import {
  GenerateDraftDto,
  generateDraftSchema,
} from './dto/generate-draft.dto';
import { AgentService } from './agent.service';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post('drafts')
  generateDraft(
    @Body(new ZodValidationPipe(generateDraftSchema)) data: GenerateDraftDto,
  ) {
    return this.agentService.generateDraft(data);
  }
}
