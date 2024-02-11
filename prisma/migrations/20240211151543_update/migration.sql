/*
  Warnings:

  - You are about to alter the column `tanggal_absensi` on the `absensi` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `tanggal_input_cuti` on the `cuti` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `tanggal_mulai_izin` on the `izin` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `tanggal_selesai_izin` on the `izin` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `tanggal_input_izin` on the `izin` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `tanggal_input_sakit` on the `sakit` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `bergabung_sejak` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the `ubahjadwal` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ubahjadwal` DROP FOREIGN KEY `UbahJadwal_id_user_fkey`;

-- AlterTable
ALTER TABLE `absensi` MODIFY `tanggal_absensi` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `cuti` MODIFY `tanggal_input_cuti` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `izin` MODIFY `tanggal_mulai_izin` DATETIME NOT NULL,
    MODIFY `tanggal_selesai_izin` DATETIME NOT NULL,
    MODIFY `status_izin` ENUM('Pending', 'Diterima', 'Ditolak') NULL DEFAULT 'Pending',
    MODIFY `tanggal_input_izin` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `sakit` MODIFY `tanggal_input_sakit` DATETIME NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `bergabung_sejak` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `ubahjadwal`;
