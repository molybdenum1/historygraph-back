import { Module } from '@nestjs/common';
import { DraftsModule } from '../drafts/drafts.module';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';

@Module({
  imports: [DraftsModule],
  controllers: [AgentController],
  providers: [AgentService],
})
export class AgentModule {}
