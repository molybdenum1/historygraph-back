import { Inject, Injectable } from "@nestjs/common";
import {
  CACHE_SERVICE,
  CacheService,
} from "../../infrastructure/cache/cache.service";
import { PrismaService } from "../../infrastructure/prisma/prisma.service";
import { TimelineQueryDto } from "./dto/timeline-query.dto";
import { TimelineResponseDto } from "./dto/timeline-response.dto";

@Injectable()
export class TimelineService {
  private readonly ttlMs = 30_000;

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_SERVICE) private readonly cache: CacheService,
  ) {}

  async getTimeline(query: TimelineQueryDto): Promise<TimelineResponseDto> {
    const cacheKey = `timeline:v1:${JSON.stringify(query)}`;
    const cached = await this.cache.get<TimelineResponseDto>(cacheKey);

    if (cached) {
      return cached;
    }

    const where = {
      type: query.type,
      dateStart: {
        not: null,
        ...(query.dateStart ? { gte: query.dateStart } : {}),
        ...(query.dateEnd ? { lte: query.dateEnd } : {}),
      },
    };

    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      this.prisma.entity.findMany({
        where,
        select: {
          id: true,
          type: true,
          name: true,
          description: true,
          dateStart: true,
          dateEnd: true,
        },
        orderBy: [{ dateStart: "asc" }, { name: "asc" }],
        skip,
        take: query.limit,
      }),
      this.prisma.entity.count({ where }),
    ]);

    const response: TimelineResponseDto = {
      items: items.map((entity) => ({
        id: entity.id,
        type: entity.type,
        label: entity.name,
        description: entity.description,
        dateStart: entity.dateStart,
        dateEnd: entity.dateEnd,
      })),
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    };

    await this.cache.set(cacheKey, response, this.ttlMs);
    return response;
  }
}
