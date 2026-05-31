# HistoryGraph AI Backend

Backend foundation for an MVP historical knowledge graph application where an AI agent produces structured drafts containing historical entities, relationships, and sources.

## Folder Structure

```text
.
├── docker-compose.yml
├── prisma
│   └── schema.prisma
├── src
│   ├── app.module.ts
│   ├── main.ts
│   ├── common
│   │   └── validation
│   │       └── zod-validation.pipe.ts
│   ├── infrastructure
│   │   └── prisma
│   │       ├── prisma.module.ts
│   │       └── prisma.service.ts
│   └── modules
│       ├── agent
│       ├── drafts
│       ├── entities
│       ├── relations
│       └── sources
```

Each feature module follows the same MVP-friendly shape:

```text
module-name
├── dto
├── repositories
├── module-name.controller.ts
├── module-name.module.ts
└── module-name.service.ts
```

## NestJS Commands

```bash
npm install
docker compose up -d
cp .env.example .env
npm run prisma:migrate -- --name init
npm run start:dev
```

Useful development commands:

```bash
npm run prisma:generate
npm run build
npm run prisma:studio
```

Set AI configuration in `.env` before calling the agent:

```bash
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4.1-mini"
```

## Architecture Decisions

The application is split into `agent`, `drafts`, `entities`, `relations`, and `sources` modules because those are the business concepts the MVP needs to protect. The agent coordinates AI generation, drafts store unapproved generated output, and entities/relations/sources represent the approved knowledge graph surface.

Controllers are intentionally thin. They accept HTTP input, validate it with Zod, and delegate business work to services. This keeps request handling separate from application behavior.

Services own application use cases. `AgentService` now owns the AI draft generation flow: build prompt, call the LLM abstraction, parse JSON, validate with Zod, save a pending draft, and return the validated structure.

Repositories hide persistence details behind TypeScript interfaces. The app currently binds those interfaces to Prisma implementations, but tests or future storage choices can replace them without rewriting service logic.

Prisma schema uses database enums for `EntityType` and `DraftStatus` because these values are stable domain constraints. Relation type remains a string because MVP historical relation categories will likely evolve quickly.

Draft `rawResponse` is stored as `Json` because early AI output will change often. Once the generated schema stabilizes, this can be normalized into draft entity/relation/source tables.

`PrismaModule` is global to avoid repetitive imports in small MVP modules. This is acceptable here because Prisma is infrastructure, not domain behavior.

OpenAI is hidden behind the `LlmClient` interface. The default binding is `OpenAiLlmClient`, but tests can provide a fake client and future providers can be added without changing `AgentService`.

## AI Agent Flow

```http
POST /agent/generate
Content-Type: application/json

{
  "topic": "French Revolution"
}
```

Response:

```json
{
  "draftId": "uuid",
  "topic": "French Revolution",
  "summary": "",
  "entities": [],
  "relations": [],
  "sources": []
}
```

Prompt template: [src/modules/agent/prompts/historical-draft.prompt.ts](src/modules/agent/prompts/historical-draft.prompt.ts)

Validation schema: [src/modules/agent/schemas/historical-draft.schema.ts](src/modules/agent/schemas/historical-draft.schema.ts)

The schema enforces allowed entity types, allowed relation types, source URL format, confidence range, exact top-level keys, and relation endpoints that match generated entity names.

## Error Handling Strategy

Request DTO errors return `400 Bad Request` through the shared Zod validation pipe.

Missing `OPENAI_API_KEY` returns `503 Service Unavailable` before attempting a remote call.

OpenAI quota or billing exhaustion returns `503 Service Unavailable` with `code: "LLM_PROVIDER_QUOTA_EXCEEDED"`. Fix this in the OpenAI dashboard by checking billing, project limits, and whether the API key belongs to the intended project.

OpenAI rate limiting returns `429 Too Many Requests` with `code: "LLM_PROVIDER_RATE_LIMITED"`.

Invalid LLM JSON returns `502 Bad Gateway`.

Schema-invalid LLM output returns `422 Unprocessable Entity` with flattened Zod issues.

Database errors are allowed to bubble through Nest's default exception layer for now. For production observability, add a global exception filter that maps Prisma errors into stable API responses.

## Retry Strategy

`AgentService` attempts generation up to 3 times with exponential backoff: 500ms, 1000ms, then final failure.

Retries cover transient LLM failures, provider rate limits, and malformed model output. Configuration and billing errors, such as a missing API key or exhausted provider quota, are not retried.

For a later production version, move retry settings into environment config and add jitter to avoid synchronized retries under load.

## Logging Strategy

Nest's `Logger` records each generation attempt, retry delay, missing API key warnings, and successful draft persistence.

Logs intentionally avoid storing full prompts or raw model responses to reduce accidental leakage of user input or generated content. Add request correlation IDs before deploying behind an API gateway.

## Implementation Order

1. Start Postgres with Docker.
2. Create `.env` from `.env.example`.
3. Run the initial Prisma migration.
4. Build CRUD endpoints for entities, relations, sources, and drafts.
5. Add approval workflow that converts a draft into persisted graph records.
6. Add tests around agent generation using a fake `LlmClient`.
7. Add approval workflow that converts generated draft JSON into persisted graph records.
8. Add source citation links between generated claims and persisted entities/relations.

## Example Endpoints

```http
POST /entities
GET /entities
GET /entities/:id
PATCH /entities/:id

POST /relations
GET /relations
GET /relations/entity/:entityId
PATCH /relations/:id

POST /sources
GET /sources
PATCH /sources/:id

POST /drafts
GET /drafts?status=pending
PATCH /drafts/:id/status

POST /agent/generate
```
