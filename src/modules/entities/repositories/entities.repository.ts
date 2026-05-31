import { Entity } from '@prisma/client';
import { CreateEntityDto, UpdateEntityDto } from '../dto/entity.dto';

export const ENTITIES_REPOSITORY = Symbol('ENTITIES_REPOSITORY');

export interface EntitiesRepository {
  create(data: CreateEntityDto): Promise<Entity>;
  findById(id: string): Promise<Entity | null>;
  findMany(): Promise<Entity[]>;
  update(id: string, data: UpdateEntityDto): Promise<Entity>;
}
