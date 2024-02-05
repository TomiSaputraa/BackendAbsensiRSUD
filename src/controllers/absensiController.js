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

// @desc Create a absensi
// @route POST /api/absensi
// @acces private
const createAbsensi = asyncHandler(async (req, res, next) => {
  // console.log(req.files);
  // console.log(req.user.id_user);
  console.log(req.user);

  // let waktu_masuk;
  // let waktu;
  let foto_masuk;
  try {
    const {
      kode_shift,
      waktu_masuk,
      waktu_pulang,
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

    const result = await prisma.absensi.create({
      data: {
        id_user: req.user.id_user,
        kode_shift,
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
