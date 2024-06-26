/*
  Warnings:

  - You are about to drop the column `parentId` on the `__folders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "__folders" DROP CONSTRAINT "__folders_parentId_fkey";

-- AlterTable
ALTER TABLE "__folders" DROP COLUMN "parentId",
ADD COLUMN     "parent_id" TEXT;

-- AddForeignKey
ALTER TABLE "__folders" ADD CONSTRAINT "__folders_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "__folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
