import { Inject, Injectable } from "@nestjs/common";
import {
  CACHE_SERVICE,
  CacheService,
} from "../../infrastructure/cache/cache.service";
import { PrismaService } from "../../infrastructure/prisma/prisma.service";
import { GraphResponseDto } from "./dto/graph-response.dto";

@Injectable()
export class GraphService {
  private readonly graphCacheKey = "graph:full:v1";
  private readonly ttlMs = 30_000;

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_SERVICE) private readonly cache: CacheService,
  ) {}

  async getGraph(): Promise<GraphResponseDto> {
    const cached = await this.cache.get<GraphResponseDto>(this.graphCacheKey);

    if (cached) {
      return cached;
    }

    const [entities, relations] = await Promise.all([
      this.prisma.entity.findMany({
        select: {
          id: true,
          type: true,
          name: true,
        },
        orderBy: [{ type: "asc" }, { name: "asc" }],
      }),
      this.prisma.relation.findMany({
        select: {
          fromEntityId: true,
          toEntityId: true,
          relationType: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const response: GraphResponseDto = {
      nodes: entities.map((entity) => ({
        id: entity.id,
        type: entity.type,
        label: entity.name,
      })),
      edges: relations.map((relation) => ({
        source: relation.fromEntityId,
        target: relation.toEntityId,
        relationType: relation.relationType,
      })),
    };

    await this.cache.set(this.graphCacheKey, response, this.ttlMs);
    return response;
  }
}
