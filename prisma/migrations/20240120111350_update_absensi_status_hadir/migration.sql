/*
  Warnings:

  - You are about to alter the column `status_hadir` on the `absensi` table. The data in that column could be lost. The data in that column will be cast from `VarChar(1)` to `VarChar(0)`.

*/
-- AlterTable
ALTER TABLE `absensi` MODIFY `status_hadir` VARCHAR(0) NOT NULL;
