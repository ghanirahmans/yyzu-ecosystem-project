-- CreateIndex
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");

-- CreateIndex
CREATE INDEX "DivisionMembership_divisionId_idx" ON "DivisionMembership"("divisionId");

-- CreateIndex
CREATE INDEX "Program_picUserId_idx" ON "Program"("picUserId");

-- CreateIndex
CREATE INDEX "Program_authorId_idx" ON "Program"("authorId");

-- CreateIndex
CREATE INDEX "Submission_teamId_idx" ON "Submission"("teamId");

-- CreateIndex
CREATE INDEX "Submission_submittedBy_idx" ON "Submission"("submittedBy");

-- CreateIndex
CREATE INDEX "UsefulLink_teamId_idx" ON "UsefulLink"("teamId");
