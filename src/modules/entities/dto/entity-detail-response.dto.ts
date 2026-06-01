import { Entity, Relation } from "@prisma/client";

export interface EntityDetailResponseDto {
  entity: Entity;
  incomingRelations: Relation[];
  outgoingRelations: Relation[];
  connectedEntities: Entity[];
}
