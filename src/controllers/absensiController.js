const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// @desc Get all Absensi
// @route GET /api/absensi
// @acces public
const getAbsensi = async (req, res) => {
  const absensi = await prisma.absensi.findMany();
  res.status(200).json({ absensi });
};

// @desc Create a absensi
// @route POST /api/absensi
// @acces public
const createAbsensi = asyncHandler(async (req, res) => {
  console.log(req.files);
  console.log(req.body);
  const {
    id_absensi,
    id_user,
    jam_masuk_absesi,
    tanggal_absensi,
    latitude_masuk,
    longtitude_masuk,
    foto_masuk,
    status_hadir,
  } = req.body;

  // cek apakah absensi sudah terdaftar
  const absensiAvailable = await prisma.absensi.findFirst({
    where: {
      id_absensi: id_absensi,
    },
  });
  if (absensiAvailable) {
    res.status(400);
    throw new Error(`Absensi dengan id ${id_absensi} sudah terdaftar`);
  }

  // Cek apakah id_user tersedia di tabel User
  const userAvailable = await prisma.user.findUnique({
    where: {
      id_user: id_user,
    },
  });
  if (!userAvailable) {
    res.status(400);
    throw new Error(`User dengan id ${id_user} tidak ditemukan`);
  }

  // Ambil path file dari req.files jika menggunakan upload.single
  const fotoMasuk = req.files[0].path;

  const result = await prisma.absensi.create({
    data: {
      id_absensi,
      id_user,
      jam_masuk_absesi,
      tanggal_absensi,
      latitude_masuk,
      longtitude_masuk,
      foto_masuk: fotoMasuk,
      status_hadir: status_hadir || "1",
    },
  });

  if (result) {
    res
      .status(201)
      .json({ message: "Absensi baru berhasil dibuat", result: result });
  } else {
    res.status(400);
    throw new Error("Absensi tidak valid");
  }
});

// @desc Update a absensi
// @route POST /api/absensi/:id
// @acces public
const updateAbsensi = async (req, res) => {
  const { id } = req.params;
  const {
    id_absensi,
    id_user,
    jam_masuk_absesi,
    tanggal_absensi,
    latitude_masuk,
    longtitude_masuk,
    foto_masuk,
    status_hadir,
  } = req.body;

  // Cek apakah ada id yang terdaftar atau tidak
  const existingUser = await prisma.absensi.findUnique({
    where: {
      id_absensi: id,
    },
  });
  if (!existingUser) {
    return res.status(404).json({ error: "Absensi tidak di temukan" });
  }

  const post = await prisma.absensi.update({
    where: { id_absensi: id },
    data: {
      id_absensi,
      id_user,
      jam_masuk_absesi,
      tanggal_absensi,
      latitude_masuk,
      longtitude_masuk,
      foto_masuk,
      status_hadir,
    },
  });
  res.json({ message: "succes put absensi with", post });
};

module.exports = { getAbsensi, createAbsensi, updateAbsensi };
