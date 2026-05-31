import { Module } from '@nestjs/common';
import { DraftsController } from './drafts.controller';
import { DraftsService } from './drafts.service';
import { DRAFTS_REPOSITORY } from './repositories/drafts.repository';
import { PrismaDraftsRepository } from './repositories/prisma-drafts.repository';

@Module({
  controllers: [DraftsController],
  providers: [
    DraftsService,
    {
      provide: DRAFTS_REPOSITORY,
      useClass: PrismaDraftsRepository,
    },
  ],
  exports: [DraftsService, DRAFTS_REPOSITORY],
})
export class DraftsModule {}
