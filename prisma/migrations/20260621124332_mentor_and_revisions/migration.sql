-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SubmissionStatus" ADD VALUE 'APPROVED';
ALTER TYPE "SubmissionStatus" ADD VALUE 'REVISION';

-- AlterEnum
ALTER TYPE "TeamStatus" ADD VALUE 'ARCHIVED';

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'MENTOR';

-- DropIndex
DROP INDEX "Submission_teamId_key";

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedBy" TEXT;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
