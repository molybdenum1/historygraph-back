import { Module } from '@nestjs/common';
import { PrismaSourcesRepository } from './repositories/prisma-sources.repository';
import { SOURCES_REPOSITORY } from './repositories/sources.repository';
import { SourcesController } from './sources.controller';
import { SourcesService } from './sources.service';

@Module({
  controllers: [SourcesController],
  providers: [
    SourcesService,
    {
      provide: SOURCES_REPOSITORY,
      useClass: PrismaSourcesRepository,
    },
  ],
  exports: [SourcesService, SOURCES_REPOSITORY],
})
export class SourcesModule {}
