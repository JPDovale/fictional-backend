-- AlterTable
ALTER TABLE "__users" ADD COLUMN     "auth_id" TEXT,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "password" DROP NOT NULL;
