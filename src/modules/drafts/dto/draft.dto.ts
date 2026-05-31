import { z } from 'zod';

export const draftStatusSchema = z.enum(['pending', 'approved', 'rejected']);

export const createDraftSchema = z.object({
  topic: z.string().min(1),
  rawResponse: z.unknown(),
  status: draftStatusSchema.optional(),
});

export const updateDraftStatusSchema = z.object({
  status: draftStatusSchema,
});

export type DraftStatusDto = z.infer<typeof draftStatusSchema>;
export type CreateDraftDto = z.infer<typeof createDraftSchema>;
export type UpdateDraftStatusDto = z.infer<typeof updateDraftStatusSchema>;
