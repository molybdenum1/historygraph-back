import { z } from 'zod';

export const createSourceSchema = z.object({
  title: z.string().min(1),
  url: z.string().url().optional(),
  description: z.string().optional(),
});

export const updateSourceSchema = createSourceSchema.partial();

export type CreateSourceDto = z.infer<typeof createSourceSchema>;
export type UpdateSourceDto = z.infer<typeof updateSourceSchema>;
