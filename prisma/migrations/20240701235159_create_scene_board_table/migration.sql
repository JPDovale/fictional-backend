-- CreateTable
CREATE TABLE "__scenes_boards" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "project_id" TEXT NOT NULL,

    CONSTRAINT "__scenes_boards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "__capitules" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "scenes_board_id" TEXT NOT NULL,

    CONSTRAINT "__capitules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "__scenes" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "file_id" TEXT NOT NULL,
    "event_id" TEXT,
    "capitule_id" TEXT NOT NULL,

    CONSTRAINT "__scenes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "__scenes_boards_id_key" ON "__scenes_boards"("id");

-- CreateIndex
CREATE UNIQUE INDEX "__capitules_id_key" ON "__capitules"("id");

-- CreateIndex
CREATE UNIQUE INDEX "__scenes_id_key" ON "__scenes"("id");

-- AddForeignKey
ALTER TABLE "__scenes_boards" ADD CONSTRAINT "__scenes_boards_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "__projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "__capitules" ADD CONSTRAINT "__capitules_scenes_board_id_fkey" FOREIGN KEY ("scenes_board_id") REFERENCES "__scenes_boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "__scenes" ADD CONSTRAINT "__scenes_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "__files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "__scenes" ADD CONSTRAINT "__scenes_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "__events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "__scenes" ADD CONSTRAINT "__scenes_capitule_id_fkey" FOREIGN KEY ("capitule_id") REFERENCES "__capitules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
