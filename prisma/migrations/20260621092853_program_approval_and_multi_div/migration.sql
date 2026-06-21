/*
  Warnings:

  - You are about to drop the column `divisionId` on the `Program` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ProgramApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'DRAFT');

-- DropForeignKey
ALTER TABLE "Program" DROP CONSTRAINT "Program_divisionId_fkey";

-- AlterTable
ALTER TABLE "Program" DROP COLUMN "divisionId",
ADD COLUMN     "approvalStatus" "ProgramApprovalStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "authorId" TEXT;

-- CreateTable
CREATE TABLE "_ProgramDivisions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProgramDivisions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProgramDivisions_B_index" ON "_ProgramDivisions"("B");

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProgramDivisions" ADD CONSTRAINT "_ProgramDivisions_A_fkey" FOREIGN KEY ("A") REFERENCES "Division"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProgramDivisions" ADD CONSTRAINT "_ProgramDivisions_B_fkey" FOREIGN KEY ("B") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
