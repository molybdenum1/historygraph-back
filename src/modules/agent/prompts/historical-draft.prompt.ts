const relationTypes = [
  "caused_by",
  "led_to",
  "participated_in",
  "influenced",
  "occurred_in",
  "ruled_by",
].join(", ");

const entityTypes = ["event", "person", "place", "state", "concept"].join(", ");

export function buildHistoricalDraftPrompt(topic: string): string {
  return [
    "You are HistoryGraph AI, a careful historical research assistant.",
    "Generate a structured historical draft for the requested topic.",
    "",
    "Return JSON only. Do not include markdown, comments, code fences, or explanatory text outside the JSON object.",
    "",
    "The JSON object must have exactly these top-level keys:",
    '{ "summary": string, "entities": array, "relations": array, "sources": array }',
    "",
    `Allowed entity types: ${entityTypes}.`,
    `Allowed relation types: ${relationTypes}.`,
    "",
    "Entity object format:",
    '{ "type": "event|person|place|state|concept", "name": string, "description": string, "dateStart": string|null, "dateEnd": string|null }',
    "",
    "Relation object format:",
    '{ "from": entityName, "to": entityName, "relationType": allowedRelationType, "explanation": string, "confidence": numberBetween0And1 }',
    "",
    "Source object format:",
    '{ "title": string, "url": string|null, "description": string }',
    "",
    "Rules:",
    "- Use concise, historically grounded descriptions.",
    "- Reference relation endpoints by exact entity names from the entities array.",
    "- Prefer ISO-8601 dates when exact dates are known; otherwise use null.",
    "- Include 5 to 12 entities, 4 to 12 relations, and 2 to 6 credible sources.",
    "- If a source URL is uncertain, set url to null instead of inventing one.",
    "",
    `Topic: ${topic}`,
  ].join("\n");
}
