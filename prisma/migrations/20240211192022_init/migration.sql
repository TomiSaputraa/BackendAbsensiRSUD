-- CreateTable
CREATE TABLE `User` (
    `id_user` VARCHAR(7) NOT NULL,
    `password_hash` VARCHAR(60) NOT NULL,
    `nama_lengkap` VARCHAR(255) NOT NULL,
    `jabatan` ENUM('Kepala_Instalasi', 'Nutrisionis', 'Logistik', 'Administrasi', 'None') NULL DEFAULT 'None',
    `ruangan` VARCHAR(20) NULL,
    `grup` ENUM('Group_1', 'Group_2', 'Juru_Masak_1', 'Juru_Masak_2', 'Pj_Lauk_Hewani', 'None') NULL DEFAULT 'None',
    `jenis_kelamin` ENUM('Pria', 'Wanita') NULL DEFAULT 'Pria',
    `email` VARCHAR(255) NULL,
    `no_hp` VARCHAR(15) NULL,
    `foto_profil` VARCHAR(255) NOT NULL,
    `bergabung_sejak` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(3),
    `role` VARCHAR(10) NULL DEFAULT 'user',

    UNIQUE INDEX `User_id_user_key`(`id_user`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Absensi` (
    `id_absensi` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` VARCHAR(7) NOT NULL,
    `kode_shift` ENUM('P', 'P1', 'P2', 'J', 'J1', 'SB', 'SB1', 'SB3', 'S1', 'N', 'L') NOT NULL DEFAULT 'L',
    `tanggal_absensi` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `waktu_masuk` VARCHAR(10) NULL,
    `waktu_pulang` VARCHAR(10) NULL,
    `telat_masuk` VARCHAR(10) NULL,
    `telat_pulang` VARCHAR(10) NULL,
    `latitude_masuk` VARCHAR(30) NULL,
    `longitude_masuk` VARCHAR(30) NULL,
    `latitude_pulang` VARCHAR(30) NULL,
    `longitude_pulang` VARCHAR(30) NULL,
    `foto_masuk` VARCHAR(255) NULL,
    `status_hadir` VARCHAR(1) NULL,

    UNIQUE INDEX `Absensi_id_absensi_key`(`id_absensi`),
    PRIMARY KEY (`id_absensi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Izin` (
    `id_izin` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` VARCHAR(7) NOT NULL,
    `tanggal_mulai_izin` DATETIME NOT NULL,
    `tanggal_selesai_izin` DATETIME NOT NULL,
    `tanggal_input_izin` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(3),
    `alasan_izin` VARCHAR(255) NOT NULL,
    `total_hari_izin` INTEGER NOT NULL,
    `status_izin` ENUM('Pending', 'Diterima', 'Ditolak') NULL DEFAULT 'Pending',

    UNIQUE INDEX `Izin_id_izin_key`(`id_izin`),
    PRIMARY KEY (`id_izin`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cuti` (
    `id_cuti` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` VARCHAR(7) NOT NULL,
    `tanggal_mulai_cuti` DATE NOT NULL,
    `tanggal_selesai_cuti` DATE NOT NULL,
    `tanggal_input_cuti` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(3),
    `alasan_cuti` VARCHAR(255) NOT NULL,
    `total_hari_cuti` INTEGER NOT NULL,
    `status_cuti` ENUM('Pending', 'Diterima', 'Ditolak') NULL DEFAULT 'Pending',

    UNIQUE INDEX `Cuti_id_cuti_key`(`id_cuti`),
    PRIMARY KEY (`id_cuti`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sakit` (
    `id_sakit` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` VARCHAR(7) NOT NULL,
    `tanggal_mulai_sakit` DATE NOT NULL,
    `tanggal_selesai_sakit` DATE NOT NULL,
    `tanggal_input_sakit` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(3),
    `alasan_sakit` VARCHAR(255) NOT NULL,
    `bukti_foto` VARCHAR(255) NOT NULL,
    `total_hari_sakit` INTEGER NOT NULL,
    `status_sakit` ENUM('Pending', 'Diterima', 'Ditolak') NULL DEFAULT 'Pending',

    UNIQUE INDEX `Sakit_id_sakit_key`(`id_sakit`),
    PRIMARY KEY (`id_sakit`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Absensi` ADD CONSTRAINT `Absensi_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Izin` ADD CONSTRAINT `Izin_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Cuti` ADD CONSTRAINT `Cuti_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Sakit` ADD CONSTRAINT `Sakit_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE NO ACTION ON UPDATE NO ACTION;
