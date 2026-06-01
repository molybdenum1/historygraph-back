import { Module } from "@nestjs/common";
import { EntitiesModule } from "../entities/entities.module";
import { RelationsModule } from "../relations/relations.module";
import { SourcesModule } from "../sources/sources.module";
import { DraftApprovalService } from "./approval/draft-approval.service";
import { EntityMapper } from "./approval/mappers/entity.mapper";
import { RelationMapper } from "./approval/mappers/relation.mapper";
import { SourceMapper } from "./approval/mappers/source.mapper";
import { DraftsController } from "./drafts.controller";
import { DraftsService } from "./drafts.service";
import { DRAFTS_REPOSITORY } from "./repositories/drafts.repository";
import { PrismaDraftsRepository } from "./repositories/prisma-drafts.repository";

@Module({
  imports: [EntitiesModule, RelationsModule, SourcesModule],
  controllers: [DraftsController],
  providers: [
    DraftApprovalService,
    EntityMapper,
    RelationMapper,
    SourceMapper,
    DraftsService,
    {
      provide: DRAFTS_REPOSITORY,
      useClass: PrismaDraftsRepository,
    },
  ],
  exports: [DraftsService, DraftApprovalService, DRAFTS_REPOSITORY],
})
export class DraftsModule {}
