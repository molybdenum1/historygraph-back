import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { ZodValidationPipe } from "../../common/validation/zod-validation.pipe";
import {
  CreateRelationDto,
  UpdateRelationDto,
  createRelationSchema,
  updateRelationSchema,
} from "./dto/relation.dto";
import { RelationsService } from "./relations.service";

@Controller("relations")
export class RelationsController {
  constructor(private readonly relationsService: RelationsService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createRelationSchema)) data: CreateRelationDto,
  ) {
    return this.relationsService.create(data);
  }

  @Get()
  findMany() {
    return this.relationsService.findMany();
  }

  @Get("entity/:entityId")
  findForEntity(@Param("entityId", ParseUUIDPipe) entityId: string) {
    return this.relationsService.findForEntity(entityId);
  }

  @Get(":id")
  findById(@Param("id", ParseUUIDPipe) id: string) {
    return this.relationsService.findByIdOrThrow(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateRelationSchema)) data: UpdateRelationDto,
  ) {
    return this.relationsService.update(id, data);
  }
}
