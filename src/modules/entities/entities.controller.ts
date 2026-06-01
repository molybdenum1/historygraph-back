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
  CreateEntityDto,
  UpdateEntityDto,
  createEntitySchema,
  updateEntitySchema,
} from "./dto/entity.dto";
import { EntitiesService } from "./entities.service";

@Controller("entities")
export class EntitiesController {
  constructor(private readonly entitiesService: EntitiesService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createEntitySchema)) data: CreateEntityDto,
  ) {
    return this.entitiesService.create(data);
  }

  @Get()
  findMany() {
    return this.entitiesService.findMany();
  }

  @Get(":id")
  findById(@Param("id", ParseUUIDPipe) id: string) {
    return this.entitiesService.findDetailByIdOrThrow(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateEntitySchema)) data: UpdateEntityDto,
  ) {
    return this.entitiesService.update(id, data);
  }
}
