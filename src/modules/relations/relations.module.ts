import { Module } from "@nestjs/common";
import { RELATIONS_REPOSITORY } from "./repositories/relations.repository";
import { PrismaRelationsRepository } from "./repositories/prisma-relations.repository";
import { RelationsController } from "./relations.controller";
import { RelationsService } from "./relations.service";

@Module({
  controllers: [RelationsController],
  providers: [
    RelationsService,
    {
      provide: RELATIONS_REPOSITORY,
      useClass: PrismaRelationsRepository,
    },
  ],
  exports: [RelationsService, RELATIONS_REPOSITORY],
})
export class RelationsModule {}
