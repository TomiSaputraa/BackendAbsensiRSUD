-- CreateTable
CREATE TABLE `User` (
    `id_user` VARCHAR(7) NOT NULL,
    `password_hash` VARCHAR(60) NULL,
    `nama_lengkap` VARCHAR(255) NULL,
    `jenis_kelamin` BOOLEAN NOT NULL DEFAULT false,
    `email` VARCHAR(255) NULL,
    `no_hp` VARCHAR(15) NULL,
    `foto_profil` VARCHAR(255) NULL,
    `status_pernikahan` BOOLEAN NOT NULL DEFAULT false,
    `bergabung_sejak` DATETIME NOT NULL,
    `role` VARCHAR(10) NOT NULL DEFAULT 'user',

    UNIQUE INDEX `User_id_user_key`(`id_user`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Absensi` (
    `id_abi` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` VARCHAR(7) NOT NULL,
    `tanggal_absensi` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `jam_masuk_absesi` TIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `latitude_masuk` VARCHAR(30) NULL,
    `longitude_masuk` VARCHAR(30) NULL,
    `longtitude_masuk` VARCHAR(30) NULL,
    `ip_address` VARCHAR(30) NULL,
    `latitude_keluar` VARCHAR(30) NULL,
    `longitude_keluar` VARCHAR(30) NULL,
    `telat_masuk` VARCHAR(10) NULL,
    `telat_keluar` VARCHAR(10) NULL,
    `foto_masuk` VARCHAR(255) NULL,
    `status_hadir` VARCHAR(1) NULL,

    UNIQUE INDEX `Absensi_id_abi_key`(`id_abi`),
    PRIMARY KEY (`id_abi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Izin` (
    `id_izin` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` VARCHAR(7) NOT NULL,
    `tanggal_mulai_izin` DATE NOT NULL,
    `tanggal_selesai_izin` DATE NOT NULL,
    `tanggal_input_izin` DATETIME NOT NULL,
    `alasan_izin` VARCHAR(255) NOT NULL,
    `total_hari_izin` INTEGER NOT NULL,
    `status_izin` ENUM('PENDING', 'DITERIMA', 'DITOLAK') NOT NULL DEFAULT 'PENDING',

    UNIQUE INDEX `Izin_id_izin_key`(`id_izin`),
    PRIMARY KEY (`id_izin`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cuti` (
    `id_cuti` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` VARCHAR(7) NOT NULL,
    `tanggal_mulai_cuti` DATE NOT NULL,
    `tanggal_selesai_cuti` DATE NOT NULL,
    `tanggal_input_cuti` DATETIME NOT NULL,
    `alasan_cuti` VARCHAR(255) NOT NULL,
    `total_hari_cuti` INTEGER NOT NULL,
    `status_cuti` ENUM('PENDING', 'DITERIMA', 'DITOLAK') NOT NULL DEFAULT 'PENDING',

    UNIQUE INDEX `Cuti_id_cuti_key`(`id_cuti`),
    PRIMARY KEY (`id_cuti`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sakit` (
    `id_sakit` VARCHAR(7) NOT NULL,
    `id_user` VARCHAR(7) NOT NULL,
    `tanggal_mulai_sakit` DATE NOT NULL,
    `tanggal_selesai_sakit` DATE NOT NULL,
    `tanggal_input_sakit` DATETIME NOT NULL,
    `alasan_sakit` VARCHAR(255) NOT NULL,
    `bukti_foto` VARCHAR(255) NOT NULL,
    `total_hari_sakit` INTEGER NOT NULL,
    `status_sakit` ENUM('PENDING', 'DITERIMA', 'DITOLAK') NOT NULL DEFAULT 'PENDING',

    UNIQUE INDEX `Sakit_id_sakit_key`(`id_sakit`),
    PRIMARY KEY (`id_sakit`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UbahJadwal` (
    `id_jadwal` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` VARCHAR(7) NOT NULL,
    `tanggal_input_ubahJadwal` DATETIME NOT NULL,
    `jam_input_ubahJadwal` DATETIME NOT NULL,
    `jam_ubahJadwal` DATETIME NOT NULL,
    `tanggal_ubahJadwal` DATE NOT NULL,
    `alasan_ubahJadwal` VARCHAR(255) NOT NULL,
    `status_ubahJadwal` ENUM('PENDING', 'DITERIMA', 'DITOLAK') NOT NULL DEFAULT 'PENDING',

    PRIMARY KEY (`id_jadwal`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Absensi` ADD CONSTRAINT `Absensi_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Izin` ADD CONSTRAINT `Izin_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cuti` ADD CONSTRAINT `Cuti_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sakit` ADD CONSTRAINT `Sakit_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UbahJadwal` ADD CONSTRAINT `UbahJadwal_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;
