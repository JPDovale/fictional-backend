-- AlterTable
ALTER TABLE "__files" ADD COLUMN     "folderId" TEXT;

-- CreateTable
CREATE TABLE "__folders" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "parentId" TEXT,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "__folders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "__folders_id_key" ON "__folders"("id");

-- AddForeignKey
ALTER TABLE "__files" ADD CONSTRAINT "__files_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "__folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "__folders" ADD CONSTRAINT "__folders_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "__folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "__folders" ADD CONSTRAINT "__folders_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "__projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
