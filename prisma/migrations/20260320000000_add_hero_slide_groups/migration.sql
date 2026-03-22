-- CreateTable
CREATE TABLE "hero_slide_groups" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_slide_groups_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "hero_slides" ADD COLUMN "groupId" INTEGER;

-- AddForeignKey
ALTER TABLE "hero_slides" ADD CONSTRAINT "hero_slides_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "hero_slide_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
