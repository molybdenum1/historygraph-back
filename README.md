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

## Architecture Decisions

The application is split into `agent`, `drafts`, `entities`, `relations`, and `sources` modules because those are the business concepts the MVP needs to protect. The agent coordinates AI generation, drafts store unapproved generated output, and entities/relations/sources represent the approved knowledge graph surface.

Controllers are intentionally thin. They accept HTTP input, validate it with Zod, and delegate business work to services. This keeps request handling separate from application behavior.

Services own application use cases. For example, `AgentService` creates a pending draft today and can later call the OpenAI API without changing the drafts module API.

Repositories hide persistence details behind TypeScript interfaces. The app currently binds those interfaces to Prisma implementations, but tests or future storage choices can replace them without rewriting service logic.

Prisma schema uses database enums for `EntityType` and `DraftStatus` because these values are stable domain constraints. Relation type remains a string because MVP historical relation categories will likely evolve quickly.

Draft `rawResponse` is stored as `Json` because early AI output will change often. Once the generated schema stabilizes, this can be normalized into draft entity/relation/source tables.

`PrismaModule` is global to avoid repetitive imports in small MVP modules. This is acceptable here because Prisma is infrastructure, not domain behavior.

## Implementation Order

1. Start Postgres with Docker.
2. Create `.env` from `.env.example`.
3. Run the initial Prisma migration.
4. Build CRUD endpoints for entities, relations, sources, and drafts.
5. Add approval workflow that converts a draft into persisted graph records.
6. Add OpenAI integration inside `AgentService`.
7. Add tests around draft approval and relation creation.
8. Add source citation links between generated claims and persisted entities/relations.

## Example Endpoints

```http
POST /api/entities
GET /api/entities
GET /api/entities/:id
PATCH /api/entities/:id

POST /api/relations
GET /api/relations
GET /api/relations/entity/:entityId
PATCH /api/relations/:id

POST /api/sources
GET /api/sources
PATCH /api/sources/:id

POST /api/drafts
GET /api/drafts?status=pending
PATCH /api/drafts/:id/status

POST /api/agent/drafts
```
