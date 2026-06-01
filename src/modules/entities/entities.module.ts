import { Module } from "@nestjs/common";
import { EntitiesController } from "./entities.controller";
import { EntitiesService } from "./entities.service";
import { ENTITIES_REPOSITORY } from "./repositories/entities.repository";
import { PrismaEntitiesRepository } from "./repositories/prisma-entities.repository";

@Module({
  controllers: [EntitiesController],
  providers: [
    EntitiesService,
    {
      provide: ENTITIES_REPOSITORY,
      useClass: PrismaEntitiesRepository,
    },
  ],
  exports: [EntitiesService, ENTITIES_REPOSITORY],
})
export class EntitiesModule {}
