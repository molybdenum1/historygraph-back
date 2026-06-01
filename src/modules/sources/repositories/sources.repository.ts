import { Source } from "@prisma/client";
import { PrismaDbClient } from "../../../infrastructure/prisma/prisma-client.type";
import { CreateSourceDto, UpdateSourceDto } from "../dto/source.dto";

export const SOURCES_REPOSITORY = Symbol("SOURCES_REPOSITORY");

export interface SourcesRepository {
  create(data: CreateSourceDto, client?: PrismaDbClient): Promise<Source>;
  findById(id: string): Promise<Source | null>;
  findByUrl(url: string, client?: PrismaDbClient): Promise<Source | null>;
  findMany(): Promise<Source[]>;
  update(id: string, data: UpdateSourceDto): Promise<Source>;
}
