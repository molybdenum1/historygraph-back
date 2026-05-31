-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('event', 'person', 'place', 'state', 'concept');

-- CreateEnum
CREATE TYPE "DraftStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "Entity" (
    "id" TEXT NOT NULL,
    "type" "EntityType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "dateStart" TIMESTAMP(3),
    "dateEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relation" (
    "id" TEXT NOT NULL,
    "fromEntityId" TEXT NOT NULL,
    "toEntityId" TEXT NOT NULL,
    "relationType" TEXT NOT NULL,
    "explanation" TEXT,
    "confidence" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Relation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "description" TEXT,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Draft" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "rawResponse" JSONB NOT NULL,
    "status" "DraftStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Draft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Entity_type_idx" ON "Entity"("type");

-- CreateIndex
CREATE INDEX "Entity_name_idx" ON "Entity"("name");

-- CreateIndex
CREATE INDEX "Relation_fromEntityId_idx" ON "Relation"("fromEntityId");

-- CreateIndex
CREATE INDEX "Relation_toEntityId_idx" ON "Relation"("toEntityId");

-- CreateIndex
CREATE INDEX "Relation_relationType_idx" ON "Relation"("relationType");

-- CreateIndex
CREATE INDEX "Draft_status_idx" ON "Draft"("status");

-- CreateIndex
CREATE INDEX "Draft_topic_idx" ON "Draft"("topic");

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_fromEntityId_fkey" FOREIGN KEY ("fromEntityId") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_toEntityId_fkey" FOREIGN KEY ("toEntityId") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
