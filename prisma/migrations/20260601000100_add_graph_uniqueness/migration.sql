-- Duplicate prevention for approved graph records.
CREATE UNIQUE INDEX "Entity_name_type_key" ON "Entity"("name", "type");

CREATE UNIQUE INDEX "Relation_fromEntityId_toEntityId_relationType_key"
ON "Relation"("fromEntityId", "toEntityId", "relationType");

CREATE UNIQUE INDEX "Source_url_key" ON "Source"("url");
