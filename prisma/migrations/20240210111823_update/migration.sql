/*
  Warnings:

  - You are about to alter the column `tanggal_absensi` on the `absensi` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `tanggal_input_cuti` on the `cuti` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `tanggal_mulai_izin` on the `izin` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `tanggal_selesai_izin` on the `izin` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `tanggal_input_izin` on the `izin` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `tanggal_input_sakit` on the `sakit` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `tanggal_input_ubahJadwal` on the `ubahjadwal` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `jam_input_ubahJadwal` on the `ubahjadwal` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `jam_ubahJadwal` on the `ubahjadwal` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `bergabung_sejak` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- DropForeignKey
ALTER TABLE `absensi` DROP FOREIGN KEY `Absensi_id_user_fkey`;

-- DropForeignKey
ALTER TABLE `cuti` DROP FOREIGN KEY `Cuti_id_user_fkey`;

-- DropForeignKey
ALTER TABLE `izin` DROP FOREIGN KEY `Izin_id_user_fkey`;

-- DropForeignKey
ALTER TABLE `sakit` DROP FOREIGN KEY `Sakit_id_user_fkey`;

-- DropForeignKey
ALTER TABLE `ubahjadwal` DROP FOREIGN KEY `UbahJadwal_id_user_fkey`;

-- AlterTable
ALTER TABLE `absensi` MODIFY `tanggal_absensi` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `cuti` MODIFY `tanggal_input_cuti` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `izin` MODIFY `tanggal_mulai_izin` DATETIME NOT NULL,
    MODIFY `tanggal_selesai_izin` DATETIME NOT NULL,
    MODIFY `tanggal_input_izin` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `sakit` MODIFY `tanggal_input_sakit` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `ubahjadwal` MODIFY `tanggal_input_ubahJadwal` DATETIME NOT NULL,
    MODIFY `jam_input_ubahJadwal` DATETIME NOT NULL,
    MODIFY `jam_ubahJadwal` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `bergabung_sejak` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `Absensi` ADD CONSTRAINT `Absensi_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Izin` ADD CONSTRAINT `Izin_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cuti` ADD CONSTRAINT `Cuti_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sakit` ADD CONSTRAINT `Sakit_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UbahJadwal` ADD CONSTRAINT `UbahJadwal_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE NO ACTION ON UPDATE CASCADE;
