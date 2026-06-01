import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Entity, Relation, Source } from "@prisma/client";
import { PrismaDbClient } from "../../../infrastructure/prisma/prisma-client.type";
import { PrismaService } from "../../../infrastructure/prisma/prisma.service";
import {
  HistoricalDraft,
  historicalDraftSchema,
} from "../../agent/schemas/historical-draft.schema";
import {
  ENTITIES_REPOSITORY,
  EntitiesRepository,
} from "../../entities/repositories/entities.repository";
import {
  RELATIONS_REPOSITORY,
  RelationsRepository,
} from "../../relations/repositories/relations.repository";
import {
  SOURCES_REPOSITORY,
  SourcesRepository,
} from "../../sources/repositories/sources.repository";
import {
  DRAFTS_REPOSITORY,
  DraftsRepository,
} from "../repositories/drafts.repository";
import { DraftApprovalResultDto } from "./dto/draft-approval-result.dto";
import {
  DraftContentValidationException,
  DraftNotPendingException,
} from "./errors/draft-approval.errors";
import { EntityMapper } from "./mappers/entity.mapper";
import { RelationMapper } from "./mappers/relation.mapper";
import { SourceMapper } from "./mappers/source.mapper";

@Injectable()
export class DraftApprovalService {
  private readonly logger = new Logger(DraftApprovalService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(DRAFTS_REPOSITORY)
    private readonly draftsRepository: DraftsRepository,
    @Inject(ENTITIES_REPOSITORY)
    private readonly entitiesRepository: EntitiesRepository,
    @Inject(RELATIONS_REPOSITORY)
    private readonly relationsRepository: RelationsRepository,
    @Inject(SOURCES_REPOSITORY)
    private readonly sourcesRepository: SourcesRepository,
    private readonly entityMapper: EntityMapper,
    private readonly relationMapper: RelationMapper,
    private readonly sourceMapper: SourceMapper,
  ) {}

  async approveDraft(draftId: string): Promise<DraftApprovalResultDto> {
    return this.prisma.$transaction(async (tx) => {
      const draft = await this.draftsRepository.findById(draftId, tx);

      if (!draft) {
        throw new NotFoundException(`Draft ${draftId} was not found`);
      }

      if (draft.status !== "pending") {
        throw new DraftNotPendingException(draft.id, draft.status);
      }

      const historicalDraft = this.parseDraftContent(draft.rawResponse);
      const entityResult = await this.upsertEntities(historicalDraft, tx);
      const sourceResult = await this.upsertSources(historicalDraft, tx);
      const relationResult = await this.upsertRelations(
        historicalDraft,
        entityResult.entitiesByName,
        tx,
      );

      await this.draftsRepository.updateStatus(draft.id, "approved", tx);

      this.logger.log(`Approved draft ${draft.id}`);

      return {
        draftId: draft.id,
        status: "approved",
        entities: entityResult.entities,
        relations: relationResult.relations,
        sources: sourceResult.sources,
        created: {
          entities: entityResult.created,
          relations: relationResult.created,
          sources: sourceResult.created,
        },
        reused: {
          entities: entityResult.reused,
          relations: relationResult.reused,
          sources: sourceResult.reused,
        },
      };
    });
  }

  private parseDraftContent(rawResponse: unknown): HistoricalDraft {
    const result = historicalDraftSchema.safeParse(rawResponse);

    if (!result.success) {
      throw new DraftContentValidationException(result.error);
    }

    return result.data;
  }

  private async upsertEntities(
    draft: HistoricalDraft,
    tx: PrismaDbClient,
  ): Promise<{
    entities: Entity[];
    entitiesByName: Map<string, Entity>;
    created: number;
    reused: number;
  }> {
    const entities: Entity[] = [];
    const entitiesByName = new Map<string, Entity>();
    let created = 0;
    let reused = 0;

    for (const draftEntity of draft.entities) {
      const data = this.entityMapper.toCreateDto(draftEntity);
      const existing = await this.entitiesRepository.findByNameAndType(
        data.name,
        data.type,
        tx,
      );

      const entity =
        existing ?? (await this.entitiesRepository.create(data, tx));

      if (existing) {
        reused += 1;
      } else {
        created += 1;
      }

      entities.push(entity);
      entitiesByName.set(draftEntity.name, entity);
      entitiesByName.set(data.name, entity);
    }

    return { entities, entitiesByName, created, reused };
  }

  private async upsertSources(
    draft: HistoricalDraft,
    tx: PrismaDbClient,
  ): Promise<{ sources: Source[]; created: number; reused: number }> {
    const sources: Source[] = [];
    let created = 0;
    let reused = 0;

    for (const draftSource of draft.sources) {
      const data = this.sourceMapper.toCreateDto(draftSource);
      const existing = data.url
        ? await this.sourcesRepository.findByUrl(data.url, tx)
        : null;

      const source =
        existing ?? (await this.sourcesRepository.create(data, tx));

      if (existing) {
        reused += 1;
      } else {
        created += 1;
      }

      sources.push(source);
    }

    return { sources, created, reused };
  }

  private async upsertRelations(
    draft: HistoricalDraft,
    entitiesByName: Map<string, Entity>,
    tx: PrismaDbClient,
  ): Promise<{ relations: Relation[]; created: number; reused: number }> {
    const relations: Relation[] = [];
    let created = 0;
    let reused = 0;

    for (const draftRelation of draft.relations) {
      const data = this.relationMapper.toCreateDto(
        draftRelation,
        entitiesByName,
      );
      const existing = await this.relationsRepository.findByEndpointsAndType(
        data.fromEntityId,
        data.toEntityId,
        data.relationType,
        tx,
      );

      const relation =
        existing ?? (await this.relationsRepository.create(data, tx));

      if (existing) {
        reused += 1;
      } else {
        created += 1;
      }

      relations.push(relation);
    }

    return { relations, created, reused };
  }
}
