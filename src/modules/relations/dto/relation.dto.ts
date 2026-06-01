import { z } from "zod";

export const createRelationSchema = z.object({
  fromEntityId: z.string().uuid(),
  toEntityId: z.string().uuid(),
  relationType: z.string().min(1),
  explanation: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
});

export const updateRelationSchema = createRelationSchema.partial();

export type CreateRelationDto = z.infer<typeof createRelationSchema>;
export type UpdateRelationDto = z.infer<typeof updateRelationSchema>;
