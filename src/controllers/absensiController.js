const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// @desc Get all Absensi
// @route GET /api/absensi
// @acces private
const getAbsensi = async (req, res) => {
  // console.log(req.user);
  const absensi = await prisma.absensi.findMany({
    where: { id_user: req.user.id_user },
  });
  res.status(200).json(absensi);
};

// @desc Create a absensi
// @route POST /api/absensi
// @acces private
const createAbsensi = asyncHandler(async (req, res) => {
  // console.log(req.files);
  console.log(req.user.id_user);

  const {
    id_absensi,
    jam_masuk_absesi,
    tanggal_absensi,
    latitude_masuk,
    longtitude_masuk,
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

  // Fungsi dibawah tidak di perlukan karna id_user sudah ada di token jwt
  // Cek apakah id_user tersedia di tabel User
  // const userAvailable = await prisma.user.findUnique({
  //   where: {
  //     id_user: id_user,
  //   },
  // });
  // if (!userAvailable) {
  //   res.status(400);
  //   throw new Error(`User dengan id ${id_user} tidak ditemukan`);
  // }

  // Ambil path file dari req.files jika menggunakan upload.single
  const fotoMasuk = req.files[0].path;

  const result = await prisma.absensi.create({
    data: {
      id_absensi,
      id_user: req.user.id_user, //id user akan sesuai dengan object id_user dari token
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
    // res.status(400);
    throw new Error("Absensi tidak valid");
  }
});

// @desc Update a absensi
// @route POST /api/absensi/:id
// @acces private
const updateAbsensi = async (req, res) => {
  const { id } = req.params;
  const {
    id_user,
    jam_masuk_absesi,
    tanggal_absensi,
    latitude_masuk,
    longtitude_masuk,

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
      jam_masuk_absesi: jam_masuk_absesi || existingAbsensi.jam_masuk_absesi,
      tanggal_absensi: tanggal_absensi || existingAbsensi.tanggal_absensi,
      latitude_masuk: latitude_masuk || existingAbsensi.latitude_masuk,
      longtitude_masuk: longtitude_masuk || existingAbsensi.longtitude_masuk,
      foto_masuk: existingAbsensi.foto_masuk,
      status_hadir: status_hadir || existingAbsensi.status_hadir,
    },
    include: {
      idUser: true,
    },
  });
  res.json({ message: "succes Update absensi", post });
};

module.exports = { getAbsensi, createAbsensi, updateAbsensi };
