/*
  Warnings:

  - You are about to alter the column `tanggal_input_cuti` on the `cuti` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `tanggal_input_izin` on the `izin` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `tanggal_input_sakit` on the `sakit` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `tanggal_input_ubahJadwal` on the `ubahjadwal` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `jam_input_ubahJadwal` on the `ubahjadwal` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `jam_ubahJadwal` on the `ubahjadwal` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `status_pernikahan` on the `user` table. All the data in the column will be lost.
  - You are about to alter the column `bergabung_sejak` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Made the column `jenis_kelamin` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `cuti` MODIFY `tanggal_input_cuti` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `izin` MODIFY `tanggal_input_izin` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `sakit` MODIFY `tanggal_input_sakit` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `ubahjadwal` MODIFY `tanggal_input_ubahJadwal` DATETIME NOT NULL,
    MODIFY `jam_input_ubahJadwal` DATETIME NOT NULL,
    MODIFY `jam_ubahJadwal` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `status_pernikahan`,
    MODIFY `jenis_kelamin` ENUM('pria', 'wanita') NOT NULL DEFAULT 'pria',
    MODIFY `bergabung_sejak` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(3);
