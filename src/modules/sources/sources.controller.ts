import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ZodValidationPipe } from '../../common/validation/zod-validation.pipe';
import {
  CreateSourceDto,
  UpdateSourceDto,
  createSourceSchema,
  updateSourceSchema,
} from './dto/source.dto';
import { SourcesService } from './sources.service';

@Controller('sources')
export class SourcesController {
  constructor(private readonly sourcesService: SourcesService) {}

  @Post()
  create(@Body(new ZodValidationPipe(createSourceSchema)) data: CreateSourceDto) {
    return this.sourcesService.create(data);
  }

  @Get()
  findMany() {
    return this.sourcesService.findMany();
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.sourcesService.findByIdOrThrow(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateSourceSchema)) data: UpdateSourceDto,
  ) {
    return this.sourcesService.update(id, data);
  }
}
