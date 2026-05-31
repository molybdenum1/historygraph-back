import { z } from "zod";
import { HistoricalDraft } from "../schemas/historical-draft.schema";

export const generateHistoricalDraftSchema = z.object({
  topic: z.string().trim().min(3).max(200),
});

export type GenerateHistoricalDraftDto = z.infer<
  typeof generateHistoricalDraftSchema
>;
export type GeneratedHistoricalDraftResponseDto = HistoricalDraft & {
  draftId: string;
  topic: string;
};
