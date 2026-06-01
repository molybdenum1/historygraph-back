import { z } from "zod";

export const entityTypeSchema = z.enum([
  "event",
  "person",
  "place",
  "state",
  "concept",
]);

export const createEntitySchema = z.object({
  type: entityTypeSchema,
  name: z.string().min(1),
  description: z.string().optional(),
  dateStart: z.coerce.date().optional(),
  dateEnd: z.coerce.date().optional(),
});

export const updateEntitySchema = createEntitySchema.partial();

export type EntityTypeDto = z.infer<typeof entityTypeSchema>;
export type CreateEntityDto = z.infer<typeof createEntitySchema>;
export type UpdateEntityDto = z.infer<typeof updateEntitySchema>;
