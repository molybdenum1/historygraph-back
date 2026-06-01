import { Module } from "@nestjs/common";
import { AgentModule } from "./modules/agent/agent.module";
import { DraftsModule } from "./modules/drafts/drafts.module";
import { EntitiesModule } from "./modules/entities/entities.module";
import { PrismaModule } from "./infrastructure/prisma/prisma.module";
import { RelationsModule } from "./modules/relations/relations.module";
import { SourcesModule } from "./modules/sources/sources.module";

@Module({
  imports: [
    PrismaModule,
    AgentModule,
    DraftsModule,
    EntitiesModule,
    RelationsModule,
    SourcesModule,
  ],
})
export class AppModule {}
