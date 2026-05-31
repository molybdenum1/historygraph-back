import { Source } from '@prisma/client';
import { CreateSourceDto, UpdateSourceDto } from '../dto/source.dto';

export const SOURCES_REPOSITORY = Symbol('SOURCES_REPOSITORY');

export interface SourcesRepository {
  create(data: CreateSourceDto): Promise<Source>;
  findById(id: string): Promise<Source | null>;
  findMany(): Promise<Source[]>;
  update(id: string, data: UpdateSourceDto): Promise<Source>;
}
