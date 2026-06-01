import { Draft } from "@prisma/client";
import { PrismaDbClient } from "../../../infrastructure/prisma/prisma-client.type";
import { CreateDraftDto, DraftStatusDto } from "../dto/draft.dto";

export const DRAFTS_REPOSITORY = Symbol("DRAFTS_REPOSITORY");

export interface DraftsRepository {
  create(data: CreateDraftDto): Promise<Draft>;
  findById(id: string, client?: PrismaDbClient): Promise<Draft | null>;
  findMany(status?: DraftStatusDto): Promise<Draft[]>;
  updateStatus(
    id: string,
    status: DraftStatusDto,
    client?: PrismaDbClient,
  ): Promise<Draft>;
}
