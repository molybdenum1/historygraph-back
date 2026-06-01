import { Injectable } from "@nestjs/common";
import { CreateEntityDto } from "../../../entities/dto/entity.dto";
import { HistoricalDraft } from "../../../agent/schemas/historical-draft.schema";
import { DraftEntityDateInvalidException } from "../errors/draft-approval.errors";

type DraftEntity = HistoricalDraft["entities"][number];

@Injectable()
export class EntityMapper {
  toCreateDto(entity: DraftEntity): CreateEntityDto {
    return {
      type: entity.type,
      name: entity.name.trim(),
      description: entity.description,
      dateStart: this.parseOptionalDate(entity, "dateStart"),
      dateEnd: this.parseOptionalDate(entity, "dateEnd"),
    };
  }

  private parseOptionalDate(
    entity: DraftEntity,
    field: "dateStart" | "dateEnd",
  ): Date | undefined {
    const value = entity[field];

    if (!value) {
      return undefined;
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      throw new DraftEntityDateInvalidException(entity.name, field);
    }

    return parsed;
  }
}
