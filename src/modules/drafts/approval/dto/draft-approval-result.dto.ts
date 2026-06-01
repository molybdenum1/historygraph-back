import { Entity, Relation, Source } from "@prisma/client";

export interface DraftApprovalResultDto {
  draftId: string;
  status: "approved";
  entities: Entity[];
  relations: Relation[];
  sources: Source[];
  created: {
    entities: number;
    relations: number;
    sources: number;
  };
  reused: {
    entities: number;
    relations: number;
    sources: number;
  };
}
