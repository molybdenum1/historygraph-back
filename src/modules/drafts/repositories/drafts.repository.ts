import { Draft } from '@prisma/client';
import { CreateDraftDto, DraftStatusDto } from '../dto/draft.dto';

export const DRAFTS_REPOSITORY = Symbol('DRAFTS_REPOSITORY');

export interface DraftsRepository {
  create(data: CreateDraftDto): Promise<Draft>;
  findById(id: string): Promise<Draft | null>;
  findMany(status?: DraftStatusDto): Promise<Draft[]>;
  updateStatus(id: string, status: DraftStatusDto): Promise<Draft>;
}
