import { z } from 'zod';

export const generateDraftSchema = z.object({
  topic: z.string().min(1),
});

export type GenerateDraftDto = z.infer<typeof generateDraftSchema>;
