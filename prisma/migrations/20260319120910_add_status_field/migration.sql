-- AlterTable
ALTER TABLE "blog_posts" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'published';

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'published';
