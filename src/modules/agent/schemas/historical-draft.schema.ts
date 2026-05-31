import { z } from "zod";

export const historicalEntityTypeSchema = z.enum([
  "event",
  "person",
  "place",
  "state",
  "concept",
]);

export const historicalRelationTypeSchema = z.enum([
  "caused_by",
  "led_to",
  "participated_in",
  "influenced",
  "occurred_in",
  "ruled_by",
]);

export const historicalDraftEntitySchema = z.object({
  type: historicalEntityTypeSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  dateStart: z.string().nullable().optional(),
  dateEnd: z.string().nullable().optional(),
});

export const historicalDraftRelationSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  relationType: historicalRelationTypeSchema,
  explanation: z.string().min(1),
  confidence: z.number().min(0).max(1),
});

export const historicalDraftSourceSchema = z.object({
  title: z.string().min(1),
  url: z.string().url().nullable().optional(),
  description: z.string().min(1),
});

export const historicalDraftBaseSchema = z
  .object({
    summary: z.string().min(1),
    entities: z.array(historicalDraftEntitySchema),
    relations: z.array(historicalDraftRelationSchema),
    sources: z.array(historicalDraftSourceSchema),
  })
  .strict();

export const historicalDraftSchema = historicalDraftBaseSchema.superRefine(
  (draft, ctx) => {
    const entityNames = new Set(draft.entities.map((entity) => entity.name));

    draft.relations.forEach((relation, index) => {
      if (!entityNames.has(relation.from)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["relations", index, "from"],
          message: "Relation source must match an entity name",
        });
      }

      if (!entityNames.has(relation.to)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["relations", index, "to"],
          message: "Relation target must match an entity name",
        });
      }
    });
  },
);

export type HistoricalDraft = z.infer<typeof historicalDraftSchema>;
