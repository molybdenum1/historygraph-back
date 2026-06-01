import { z } from "zod";
import { entityTypeSchema } from "../../entities/dto/entity.dto";

export const timelineQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  dateStart: z.coerce.date().optional(),
  dateEnd: z.coerce.date().optional(),
  type: entityTypeSchema.default("event"),
});

export type TimelineQueryDto = z.infer<typeof timelineQuerySchema>;
