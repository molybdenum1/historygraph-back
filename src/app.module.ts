import { Module } from "@nestjs/common";
import { AgentModule } from "./modules/agent/agent.module";
import { DraftsModule } from "./modules/drafts/drafts.module";
import { EntitiesModule } from "./modules/entities/entities.module";
import { CacheModule } from "./infrastructure/cache/cache.module";
import { GraphModule } from "./modules/graph/graph.module";
import { PrismaModule } from "./infrastructure/prisma/prisma.module";
import { RelationsModule } from "./modules/relations/relations.module";
import { SourcesModule } from "./modules/sources/sources.module";

@Module({
  imports: [
    PrismaModule,
    CacheModule,
    AgentModule,
    DraftsModule,
    EntitiesModule,
    GraphModule,
    RelationsModule,
    SourcesModule,
  ],
})
export class AppModule {}
