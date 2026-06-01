import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ZodValidationPipe } from "../../common/validation/zod-validation.pipe";
import {
  CreateDraftDto,
  DraftStatusDto,
  UpdateDraftStatusDto,
  createDraftSchema,
  draftStatusSchema,
  updateDraftStatusSchema,
} from "./dto/draft.dto";
import { DraftApprovalService } from "./approval/draft-approval.service";
import { DraftsService } from "./drafts.service";

@Controller("drafts")
export class DraftsController {
  constructor(
    private readonly draftsService: DraftsService,
    private readonly draftApprovalService: DraftApprovalService,
  ) {}

  @Post()
  create(@Body(new ZodValidationPipe(createDraftSchema)) data: CreateDraftDto) {
    return this.draftsService.create(data);
  }

  @Get()
  findMany(@Query("status") status?: string) {
    const parsedStatus = status ? draftStatusSchema.parse(status) : undefined;
    return this.draftsService.findMany(parsedStatus);
  }

  @Get(":id")
  findById(@Param("id", ParseUUIDPipe) id: string) {
    return this.draftsService.findByIdOrThrow(id);
  }

  @Post(":id/approve")
  approve(@Param("id", ParseUUIDPipe) id: string) {
    return this.draftApprovalService.approveDraft(id);
  }

  @Patch(":id/status")
  updateStatus(
    @Param("id", ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateDraftStatusSchema))
    data: UpdateDraftStatusDto,
  ) {
    return this.draftsService.updateStatus(id, data.status as DraftStatusDto);
  }
}
