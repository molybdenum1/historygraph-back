import { Injectable } from '@nestjs/common';
import { Draft } from '@prisma/client';
import { DraftsService } from '../drafts/drafts.service';
import { GenerateDraftDto } from './dto/generate-draft.dto';

@Injectable()
export class AgentService {
  constructor(private readonly draftsService: DraftsService) {}

  async generateDraft(data: GenerateDraftDto): Promise<Draft> {
    const rawResponse = {
      topic: data.topic,
      entities: [],
      relations: [],
      sources: [],
      note: 'OpenAI generation will replace this placeholder.',
    };

    return this.draftsService.create({
      topic: data.topic,
      rawResponse,
      status: 'pending',
    });
  }
}
