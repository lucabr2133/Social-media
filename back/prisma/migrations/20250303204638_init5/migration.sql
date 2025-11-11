-- AlterTable
ALTER TABLE "comments" ALTER COLUMN "post_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "publications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
