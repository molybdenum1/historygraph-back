import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Source } from "@prisma/client";
import { CreateSourceDto, UpdateSourceDto } from "./dto/source.dto";
import {
  SOURCES_REPOSITORY,
  SourcesRepository,
} from "./repositories/sources.repository";

@Injectable()
export class SourcesService {
  constructor(
    @Inject(SOURCES_REPOSITORY)
    private readonly sourcesRepository: SourcesRepository,
  ) {}

  create(data: CreateSourceDto): Promise<Source> {
    return this.sourcesRepository.create(data);
  }

  findMany(): Promise<Source[]> {
    return this.sourcesRepository.findMany();
  }

  async findByIdOrThrow(id: string): Promise<Source> {
    const source = await this.sourcesRepository.findById(id);

    if (!source) {
      throw new NotFoundException(`Source ${id} was not found`);
    }

    return source;
  }

  update(id: string, data: UpdateSourceDto): Promise<Source> {
    return this.sourcesRepository.update(id, data);
  }
}
