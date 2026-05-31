import { Relation } from '@prisma/client';
import { CreateRelationDto, UpdateRelationDto } from '../dto/relation.dto';

export const RELATIONS_REPOSITORY = Symbol('RELATIONS_REPOSITORY');

export interface RelationsRepository {
  create(data: CreateRelationDto): Promise<Relation>;
  findById(id: string): Promise<Relation | null>;
  findMany(): Promise<Relation[]>;
  findForEntity(entityId: string): Promise<Relation[]>;
  update(id: string, data: UpdateRelationDto): Promise<Relation>;
}
