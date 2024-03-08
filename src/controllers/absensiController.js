const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");

// @desc Get all Absensi
// @route GET /api/absensi
// @acces private
const getAbsensi = asyncHandler(async (req, res, next) => {
  // console.log(req.user);
  try {
    // Get absensi berdasarkan user lalu sortir berdasarkan post data terakhir
    const absensi = await prisma.user.findUnique({
      where: { id_user: req.user.id_user },
      select: {
        Absensi: {
          orderBy: { id_absensi: "desc" },
          // take: 1, // Jumlah yang ingin ditampilkan
        },
      },
    });
    if (!absensi) {
      res.status(404);
      throw new Error("Absensi tidak ditemukan");
    }

    res.status(200).json(absensi);
  } catch (error) {
    next(error);
  }
});

const shiftTimes = {
  P: { waktu_masuk: "07.30", waktu_pulang: "14.00" },
  P1: { waktu_masuk: "05.00", waktu_pulang: "12.00" },
  P2: { waktu_masuk: "06.00", waktu_pulang: "13.00" },
  J: { waktu_masuk: "07.15", waktu_pulang: "11.15" },
  J1: { waktu_masuk: "07.30", waktu_pulang: "12.30" },
  SB: { waktu_masuk: "07.15", waktu_pulang: "13.45" },
  SB1: { waktu_masuk: "07.30", waktu_pulang: "13.45" },
  SB3: { waktu_masuk: "06.00", waktu_pulang: "12.30" },
  S1: { waktu_masuk: "13.00", waktu_pulang: "19.00" },
  N: { waktu_masuk: "07.15", waktu_pulang: "14.00" },
  default: { waktu_masuk: "00.00", waktu_pulang: "00.00" },
};

const getShiftTimes = (kode_shift) => {
  return shiftTimes[kode_shift] || shiftTimes["default"];
};

// @desc Create a absensi
// @route POST /api/absensi
// @acces private
const createAbsensi = asyncHandler(async (req, res, next) => {
  // console.log(req.files);
  // console.log(req.user.id_user);
  console.log(req.user);

  let foto_masuk;
  try {
    const {
      kode_shift,
      latitude_masuk,
      longitude_masuk,
      latitude_pulang,
      longitude_pulang,
      telat_masuk,
      telat_pulang,
      status_hadir,
    } = req.body;

    if (req.files && req.files.length > 0) {
      foto_masuk = req.files[0].path;
      console.log("foto masuk : ", foto_masuk);
    }

    const { waktu_masuk, waktu_pulang } = getShiftTimes(kode_shift);

    const result = await prisma.absensi.create({
      data: {
        id_user: req.user.id_user,
        kode_shift,
        waktu_masuk: waktu_masuk,
        waktu_pulang: waktu_pulang,
        telat_masuk,
        telat_pulang,
        latitude_masuk,
        longitude_masuk,
        latitude_pulang,
        longitude_pulang,
        foto_masuk: foto_masuk,
        status_hadir: status_hadir || "1",
      },
    });

    if (result) {
      res.status(201).json({ message: "Absensi baru berhasil dibuat", result });
    } else {
      res.status(400);
      throw new Error("Absensi tidak valid");
    }
  } catch (err) {
    // Jika ada error maka gagal upload foto ke folder uploads
    if (foto_masuk) {
      fs.unlinkSync(foto_masuk);
    }
    next(err);
  }
});

// @desc Update a absensi
// @route POST /api/absensi/:id
// @acces private
const updateAbsensi = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      kode_shift,
      telat_masuk,
      telat_pulang,
      latitude_masuk,
      longitude_masuk,
      latitude_pulang,
      longitude_pulang,
      status_hadir,
    } = req.body;

    // console.log(req);
    // Cek apakah ada id yang terdaftar atau tidak
    const existingAbsensi = await prisma.absensi.findUnique({
      where: {
        id_absensi: parseInt(id),
      },
    });
    if (!existingAbsensi) {
      res.status(404);
      throw new Error("Absensi tidak di temukan");
    }

    // Set waktu masuk dan waktu pulang berdasarkan kode_shift jika tersedia
    let waktu_masuk;
    let waktu_pulang;

    if (kode_shift) {
      const shiftData = getShiftTimes(kode_shift);
      waktu_masuk = shiftData.waktu_masuk;
      waktu_pulang = shiftData.waktu_pulang;
    }

    const post = await prisma.absensi.update({
      where: { id_absensi: parseInt(id) },
      data: {
        kode_shift: kode_shift || existingAbsensi.kode_shift,
        waktu_masuk: waktu_masuk || existingAbsensi.waktu_masuk,
        waktu_pulang: waktu_pulang || existingAbsensi.waktu_pulang,
        telat_masuk: telat_masuk || existingAbsensi.waktu_masuk,
        telat_pulang: telat_pulang || existingAbsensi.telat_pulang,
        latitude_masuk: latitude_masuk || existingAbsensi.latitude_masuk,
        longitude_masuk: longitude_masuk || existingAbsensi.longitude_masuk,
        latitude_pulang: latitude_pulang || existingAbsensi.latitude_pulang,
        longitude_pulang: longitude_pulang || existingAbsensi.longitude_pulang,
        status_hadir: status_hadir || existingAbsensi.status_hadir,
      },
    });
    res.status(200).json({ message: "succes Update absensi", post });
  } catch (error) {
    next(error);
  }
});

// @desc Check absensi created today
// @route GET /api/absensi/checkAbsesiToday
// @acces private
const checkAbsensiToday = asyncHandler(async (req, res, next) => {
  try {
    const absensi = await prisma.user.findUnique({
      where: { id_user: req.user.id_user },
      select: {
        Absensi: {
          orderBy: { id_absensi: "desc" }, // urut dari terakhir
          take: 1, // hanya ambil satu data absensi
        },
      },
    });

    if (!absensi) {
      res.status(404);
      throw new Error("Absensi user tidak di temukan");
    }

    const singleAbsensi = absensi.Absensi[0];
    res.status(200).json(singleAbsensi);
  } catch (error) {
    next(error);
  }
});

module.exports = {
  getAbsensi,
  createAbsensi,
  updateAbsensi,
  checkAbsensiToday,
};
