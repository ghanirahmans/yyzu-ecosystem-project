-- CreateEnum
CREATE TYPE "LinkScope" AS ENUM ('ORG', 'DIVISION', 'TEAM');

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'BPH';

-- DropForeignKey
ALTER TABLE "UsefulLink" DROP CONSTRAINT "UsefulLink_teamId_fkey";

-- AlterTable
ALTER TABLE "UsefulLink" ADD COLUMN     "divisionId" TEXT,
ADD COLUMN     "scope" "LinkScope" NOT NULL DEFAULT 'TEAM',
ALTER COLUMN "teamId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "UsefulLink_scope_idx" ON "UsefulLink"("scope");

-- CreateIndex
CREATE INDEX "UsefulLink_divisionId_idx" ON "UsefulLink"("divisionId");

-- AddForeignKey
ALTER TABLE "UsefulLink" ADD CONSTRAINT "UsefulLink_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsefulLink" ADD CONSTRAINT "UsefulLink_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE SET NULL ON UPDATE CASCADE;
