import { Injectable } from "@nestjs/common";
import { Source } from "@prisma/client";
import { PrismaDbClient } from "../../../infrastructure/prisma/prisma-client.type";
import { PrismaService } from "../../../infrastructure/prisma/prisma.service";
import { CreateSourceDto, UpdateSourceDto } from "../dto/source.dto";
import { SourcesRepository } from "./sources.repository";

@Injectable()
export class PrismaSourcesRepository implements SourcesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    data: CreateSourceDto,
    client: PrismaDbClient = this.prisma,
  ): Promise<Source> {
    return client.source.create({ data });
  }

  findById(id: string): Promise<Source | null> {
    return this.prisma.source.findUnique({ where: { id } });
  }

  findByUrl(
    url: string,
    client: PrismaDbClient = this.prisma,
  ): Promise<Source | null> {
    return client.source.findUnique({ where: { url } });
  }

  findMany(): Promise<Source[]> {
    return this.prisma.source.findMany({ orderBy: { title: "asc" } });
  }

  update(id: string, data: UpdateSourceDto): Promise<Source> {
    return this.prisma.source.update({ where: { id }, data });
  }
}
