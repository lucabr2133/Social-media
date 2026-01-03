/*
  Warnings:

  - You are about to drop the column `created_at` on the `Notifcations` table. All the data in the column will be lost.
  - You are about to drop the column `messagge` on the `Notifcations` table. All the data in the column will be lost.
  - Added the required column `actorId` to the `Notifcations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notifcations" DROP COLUMN "created_at",
DROP COLUMN "messagge",
ADD COLUMN     "actorId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Notifcations" ADD CONSTRAINT "Notifcations_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
