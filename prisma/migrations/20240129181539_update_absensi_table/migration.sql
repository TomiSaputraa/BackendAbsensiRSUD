/*
  Warnings:

  - The primary key for the `absensi` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_abi` on the `absensi` table. All the data in the column will be lost.
  - You are about to alter the column `tanggal_input_cuti` on the `cuti` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `tanggal_input_izin` on the `izin` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `tanggal_input_sakit` on the `sakit` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `tanggal_input_ubahJadwal` on the `ubahjadwal` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `jam_input_ubahJadwal` on the `ubahjadwal` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `jam_ubahJadwal` on the `ubahjadwal` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `bergabung_sejak` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - A unique constraint covering the columns `[id_absensi]` on the table `Absensi` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_absensi` to the `Absensi` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Absensi_id_abi_key` ON `absensi`;

-- AlterTable
ALTER TABLE `absensi` DROP PRIMARY KEY,
    DROP COLUMN `id_abi`,
    ADD COLUMN `id_absensi` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_absensi`);

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
ALTER TABLE `user` MODIFY `bergabung_sejak` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `Absensi_id_absensi_key` ON `Absensi`(`id_absensi`);
