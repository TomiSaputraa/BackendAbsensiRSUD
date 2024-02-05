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
    const absensi = await prisma.absensi.findMany({
      where: { id_user: req.user.id_user },
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

  let waktu_masuk;
  let waktu_pulang;
  let foto_masuk;
  try {
    const {
      kode_shift,
      latitude_masuk,
      longitude_masuk,
      ip_address,
      latitude_pulang,
      longitude_pulang,
      telat_masuk,
      telat_pulang,
      status_hadir,
    } = req.body;

    // Ambil path file dari req.files jika menggunakan upload.single
    //
    if (req.files && req.files.length > 0) {
      foto_masuk = req.files[0].path;
      console.log("foto masuk : ", foto_masuk);
    }

    // switch (kode_shift) {
    //   case "P":
    //     waktu_masuk = "07.30";
    //     waktu_pulang = "14.00";
    //     break;
    //   case "P1":
    //     waktu_masuk = "05.00";
    //     waktu_pulang = "12.00";
    //     break;
    //   case "P2":
    //     waktu_masuk = "06.00";
    //     waktu_pulang = "13.00";
    //     break;
    //   case "J":
    //     waktu_masuk = "07.15";
    //     waktu_pulang = "11.15";
    //     break;
    //   case "J1":
    //     waktu_masuk = "07.30";
    //     waktu_pulang = "12.30";
    //     break;
    //   case "SB":
    //     waktu_masuk = "07.15";
    //     waktu_pulang = "13.45";
    //     break;
    //   case "SB1":
    //     waktu_masuk = "07.30";
    //     waktu_pulang = "13.45";
    //   case "SB3":
    //     waktu_masuk = "06.00";
    //     waktu_pulang = "12.30";
    //     break;
    //   case "S1":
    //     waktu_masuk = "13.00";
    //     waktu_pulang = "19.00";
    //     break;
    //   case "N":
    //     waktu_masuk = "07.15";
    //     waktu_pulang = "14.00";
    //     break;
    //   default:
    //     waktu_masuk = "00.00";
    //     waktu_pulang = "00.00";
    //     break;
    // }

    const { waktu_masuk, waktu_pulang } = getShiftTimes(kode_shift);

    const result = await prisma.absensi.create({
      data: {
        id_user: req.user.id_user,
        kode_shift,
        waktu_masuk: waktu_masuk,
        waktu_pulang: waktu_pulang,
        latitude_masuk,
        longitude_masuk,
        ip_address,
        latitude_pulang,
        longitude_pulang,
        telat_masuk,
        telat_pulang,
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
const updateAbsensi = async (req, res) => {
  const { id } = req.params;
  const {
    latitude_masuk,
    longitude_masuk,
    ip_address,
    latitude_keluar,
    longitude_keluar,
    telat_masuk,
    telat_keluar,
    status_hadir,
  } = req.body;

  console.log(req);
  // Cek apakah ada id yang terdaftar atau tidak
  const existingAbsensi = await prisma.absensi.findUnique({
    where: {
      id_absensi: id,
    },
  });
  if (!existingAbsensi) {
    return res.status(404).json({ error: "Absensi tidak di temukan" });
  }

  // const foto_masuk = req.files[0].path;

  const post = await prisma.absensi.update({
    where: { id_absensi: id },
    data: {
      id_user,
      latitude_masuk,
      longitude_masuk,
      ip_address,
      latitude_keluar,
      longitude_keluar,
      telat_masuk,
      telat_keluar,
      status_hadir,
    },
    include: {
      idUser: true,
    },
  });
  res.json({ message: "succes Update absensi", post });
};

module.exports = { getAbsensi, createAbsensi, updateAbsensi };
