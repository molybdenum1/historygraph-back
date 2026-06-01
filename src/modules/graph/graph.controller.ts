import { Controller, Get, Query } from "@nestjs/common";
import { ZodValidationPipe } from "../../common/validation/zod-validation.pipe";
import { GraphService } from "./graph.service";
import {
  TimelineQueryDto,
  timelineQuerySchema,
} from "./dto/timeline-query.dto";
import { TimelineService } from "./timeline.service";

@Controller()
export class GraphController {
  constructor(
    private readonly graphService: GraphService,
    private readonly timelineService: TimelineService,
  ) {}

  @Get("graph")
  getGraph() {
    return this.graphService.getGraph();
  }

  @Get("timeline")
  getTimeline(
    @Query(new ZodValidationPipe(timelineQuerySchema)) query: TimelineQueryDto,
  ) {
    return this.timelineService.getTimeline(query);
  }
}
