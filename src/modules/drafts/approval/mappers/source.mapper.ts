import { Injectable } from "@nestjs/common";
import { CreateSourceDto } from "../../../sources/dto/source.dto";
import { HistoricalDraft } from "../../../agent/schemas/historical-draft.schema";

type DraftSource = HistoricalDraft["sources"][number];

@Injectable()
export class SourceMapper {
  toCreateDto(source: DraftSource): CreateSourceDto {
    return {
      title: source.title.trim(),
      url: source.url ?? undefined,
      description: source.description,
    };
  }
}
