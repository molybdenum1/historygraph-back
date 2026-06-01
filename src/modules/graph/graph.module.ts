import { Module } from "@nestjs/common";
import { GraphController } from "./graph.controller";
import { GraphService } from "./graph.service";
import { TimelineService } from "./timeline.service";

@Module({
  controllers: [GraphController],
  providers: [GraphService, TimelineService],
})
export class GraphModule {}
