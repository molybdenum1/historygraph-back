import {
  ConflictException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { ZodError } from "zod";

export class DraftNotPendingException extends ConflictException {
  constructor(draftId: string, status: string) {
    super({
      message: `Draft ${draftId} cannot be approved because its status is ${status}`,
      code: "DRAFT_NOT_PENDING",
    });
  }
}

export class DraftContentValidationException extends UnprocessableEntityException {
  constructor(error: ZodError) {
    super({
      message: "Draft content does not match the historical draft schema",
      code: "DRAFT_CONTENT_INVALID",
      issues: error.flatten(),
    });
  }
}

export class DraftRelationEntityMissingException extends UnprocessableEntityException {
  constructor(entityName: string) {
    super({
      message: `Relation references unknown entity "${entityName}"`,
      code: "DRAFT_RELATION_ENTITY_MISSING",
    });
  }
}

export class DraftEntityDateInvalidException extends UnprocessableEntityException {
  constructor(entityName: string, field: "dateStart" | "dateEnd") {
    super({
      message: `Entity "${entityName}" has an invalid ${field}`,
      code: "DRAFT_ENTITY_DATE_INVALID",
    });
  }
}
