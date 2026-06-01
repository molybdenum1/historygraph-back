import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Draft } from "@prisma/client";
import { CreateDraftDto, DraftStatusDto } from "./dto/draft.dto";
import {
  DRAFTS_REPOSITORY,
  DraftsRepository,
} from "./repositories/drafts.repository";

@Injectable()
export class DraftsService {
  constructor(
    @Inject(DRAFTS_REPOSITORY)
    private readonly draftsRepository: DraftsRepository,
  ) {}

  create(data: CreateDraftDto): Promise<Draft> {
    return this.draftsRepository.create(data);
  }

  findMany(status?: DraftStatusDto): Promise<Draft[]> {
    return this.draftsRepository.findMany(status);
  }

  async findByIdOrThrow(id: string): Promise<Draft> {
    const draft = await this.draftsRepository.findById(id);

    if (!draft) {
      throw new NotFoundException(`Draft ${id} was not found`);
    }

    return draft;
  }

  updateStatus(id: string, status: DraftStatusDto): Promise<Draft> {
    return this.draftsRepository.updateStatus(id, status);
  }
}
