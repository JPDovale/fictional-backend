-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('BOOK');

-- CreateEnum
CREATE TYPE "ProjectStructureType" AS ENUM ('FICTIONAL_FLOW');

-- CreateEnum
CREATE TYPE "PersonType" AS ENUM ('PROTAGONIST', 'ANTAGONIST', 'SUPPORTING', 'SECONDARY', 'ADVERSARY', 'MENTOR', 'COMIC', 'SYMBOLIC', 'EXTRA');

-- CreateEnum
CREATE TYPE "AttributeType" AS ENUM ('APPEARANCE', 'DREAM', 'OBJECTIVE', 'PERSONALITY', 'TRAUMA', 'VALUE', 'HOBBY', 'FEAR', 'MOTIVATION', 'ADDICTION', 'DESIRE', 'HABIT');

-- CreateEnum
CREATE TYPE "PersonEventType" AS ENUM ('BIRTH', 'DEATH');

-- CreateTable
CREATE TABLE "__users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "__users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "__refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_in" TIMESTAMP(3) NOT NULL,
    "expired_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "__refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "__projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ProjectType" NOT NULL,
    "structureType" "ProjectStructureType" NOT NULL,
    "image_url" TEXT,
    "build_blocks" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "user_id" TEXT NOT NULL,

    CONSTRAINT "__projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "__foundations" (
    "id" TEXT NOT NULL,
    "foundation" TEXT,
    "what" TEXT,
    "why" TEXT,
    "where" TEXT,
    "who" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "project_id" TEXT NOT NULL,

    CONSTRAINT "__foundations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "__persons" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "history" TEXT,
    "image_url" TEXT,
    "type" "PersonType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "project_id" TEXT NOT NULL,
    "affiliation_id" TEXT,

    CONSTRAINT "__persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "__affiliations" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "father_id" TEXT NOT NULL,
    "mother_id" TEXT NOT NULL,

    CONSTRAINT "__affiliations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "__attributes" (
    "id" TEXT NOT NULL,
    "type" "AttributeType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "file_id" TEXT NOT NULL,

    CONSTRAINT "__attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "__files" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "project_id" TEXT NOT NULL,

    CONSTRAINT "__files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "__attributes_mutations" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "attribute_id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,
    "event_id" TEXT,

    CONSTRAINT "__attributes_mutations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "__timelines" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "project_id" TEXT NOT NULL,

    CONSTRAINT "__timelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "__events" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "importance_level" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "timeline_id" TEXT NOT NULL,

    CONSTRAINT "__events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "__person_events" (
    "id" TEXT NOT NULL,
    "type" "PersonEventType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "event_id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,

    CONSTRAINT "__person_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AttributeToPerson" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "__users_id_key" ON "__users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "__users_email_key" ON "__users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "__users_username_key" ON "__users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "__refresh_tokens_id_key" ON "__refresh_tokens"("id");

-- CreateIndex
CREATE UNIQUE INDEX "__projects_id_key" ON "__projects"("id");

-- CreateIndex
CREATE UNIQUE INDEX "__foundations_id_key" ON "__foundations"("id");

-- CreateIndex
CREATE UNIQUE INDEX "__foundations_project_id_key" ON "__foundations"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "__persons_id_key" ON "__persons"("id");

-- CreateIndex
CREATE UNIQUE INDEX "__affiliations_id_key" ON "__affiliations"("id");

-- CreateIndex
CREATE UNIQUE INDEX "__attributes_id_key" ON "__attributes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "__files_id_key" ON "__files"("id");

-- CreateIndex
CREATE UNIQUE INDEX "__attributes_mutations_id_key" ON "__attributes_mutations"("id");

-- CreateIndex
CREATE UNIQUE INDEX "__timelines_id_key" ON "__timelines"("id");

-- CreateIndex
CREATE UNIQUE INDEX "__events_id_key" ON "__events"("id");

-- CreateIndex
CREATE UNIQUE INDEX "__person_events_id_key" ON "__person_events"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_AttributeToPerson_AB_unique" ON "_AttributeToPerson"("A", "B");

-- CreateIndex
CREATE INDEX "_AttributeToPerson_B_index" ON "_AttributeToPerson"("B");

-- AddForeignKey
ALTER TABLE "__refresh_tokens" ADD CONSTRAINT "__refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "__users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "__projects" ADD CONSTRAINT "__projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "__users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "__foundations" ADD CONSTRAINT "__foundations_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "__projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "__persons" ADD CONSTRAINT "__persons_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "__projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "__persons" ADD CONSTRAINT "__persons_affiliation_id_fkey" FOREIGN KEY ("affiliation_id") REFERENCES "__affiliations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "__affiliations" ADD CONSTRAINT "__affiliations_father_id_fkey" FOREIGN KEY ("father_id") REFERENCES "__persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "__affiliations" ADD CONSTRAINT "__affiliations_mother_id_fkey" FOREIGN KEY ("mother_id") REFERENCES "__persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "__attributes" ADD CONSTRAINT "__attributes_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "__files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "__files" ADD CONSTRAINT "__files_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "__projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "__attributes_mutations" ADD CONSTRAINT "__attributes_mutations_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "__attributes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "__attributes_mutations" ADD CONSTRAINT "__attributes_mutations_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "__files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "__attributes_mutations" ADD CONSTRAINT "__attributes_mutations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "__events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "__timelines" ADD CONSTRAINT "__timelines_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "__projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "__events" ADD CONSTRAINT "__events_timeline_id_fkey" FOREIGN KEY ("timeline_id") REFERENCES "__timelines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "__person_events" ADD CONSTRAINT "__person_events_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "__events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "__person_events" ADD CONSTRAINT "__person_events_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "__persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttributeToPerson" ADD CONSTRAINT "_AttributeToPerson_A_fkey" FOREIGN KEY ("A") REFERENCES "__attributes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttributeToPerson" ADD CONSTRAINT "_AttributeToPerson_B_fkey" FOREIGN KEY ("B") REFERENCES "__persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
