/*
  Warnings:

  - You are about to drop the column `latitude_keluar` on the `absensi` table. All the data in the column will be lost.
  - You are about to drop the column `longitude_keluar` on the `absensi` table. All the data in the column will be lost.
  - You are about to drop the column `telat_keluar` on the `absensi` table. All the data in the column will be lost.
  - You are about to drop the column `waktu_keluar` on the `absensi` table. All the data in the column will be lost.
  - You are about to alter the column `tanggal_absensi` on the `absensi` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `tanggal_input_cuti` on the `cuti` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `tanggal_input_izin` on the `izin` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `tanggal_input_sakit` on the `sakit` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `tanggal_input_ubahJadwal` on the `ubahjadwal` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `jam_input_ubahJadwal` on the `ubahjadwal` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `jam_ubahJadwal` on the `ubahjadwal` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `bergabung_sejak` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `kode_shift` to the `Absensi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `absensi` DROP COLUMN `latitude_keluar`,
    DROP COLUMN `longitude_keluar`,
    DROP COLUMN `telat_keluar`,
    DROP COLUMN `waktu_keluar`,
    ADD COLUMN `kode_shift` ENUM('P', 'P1', 'P2', 'J', 'J1', 'SB', 'SB1', 'SB3', 'S1', 'N', 'L') NOT NULL,
    ADD COLUMN `latitude_pulang` VARCHAR(30) NULL,
    ADD COLUMN `longitude_pulang` VARCHAR(30) NULL,
    ADD COLUMN `telat_pulang` VARCHAR(10) NULL,
    ADD COLUMN `waktu_pulang` TIME NULL,
    MODIFY `tanggal_absensi` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

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
