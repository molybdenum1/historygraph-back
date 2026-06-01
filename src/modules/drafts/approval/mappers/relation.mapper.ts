import { Injectable } from "@nestjs/common";
import { Entity } from "@prisma/client";
import { CreateRelationDto } from "../../../relations/dto/relation.dto";
import { HistoricalDraft } from "../../../agent/schemas/historical-draft.schema";
import { DraftRelationEntityMissingException } from "../errors/draft-approval.errors";

type DraftRelation = HistoricalDraft["relations"][number];

@Injectable()
export class RelationMapper {
  toCreateDto(
    relation: DraftRelation,
    entitiesByName: Map<string, Entity>,
  ): CreateRelationDto {
    const fromEntity = entitiesByName.get(relation.from);
    const toEntity = entitiesByName.get(relation.to);

    if (!fromEntity) {
      throw new DraftRelationEntityMissingException(relation.from);
    }

    if (!toEntity) {
      throw new DraftRelationEntityMissingException(relation.to);
    }

    return {
      fromEntityId: fromEntity.id,
      toEntityId: toEntity.id,
      relationType: relation.relationType,
      explanation: relation.explanation,
      confidence: relation.confidence,
    };
  }
}
