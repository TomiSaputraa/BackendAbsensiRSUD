-- CreateTable
CREATE TABLE `Absensi` (
    `id_absensi` CHAR(7) NOT NULL,
    `id_user` VARCHAR(7) NOT NULL,
    `jam_masuk_absesi` TIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tanggal_absensi` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `latitude_masuk` VARCHAR(30) NOT NULL,
    `longtitude_masuk` VARCHAR(30) NOT NULL,
    `foto_masuk` VARCHAR(30) NOT NULL,
    `status_hadir` VARCHAR(1) NOT NULL,

    PRIMARY KEY (`id_absensi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id_user` VARCHAR(7) NOT NULL,
    `password` VARCHAR(30) NOT NULL,
    `nama_lengkap` VARCHAR(40) NULL,
    `bergabung_sejak` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Absensi` ADD CONSTRAINT `Absensi_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;
