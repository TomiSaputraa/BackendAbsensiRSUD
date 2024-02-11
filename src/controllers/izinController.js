const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createIzin = asyncHandler(async (req, res, next) => {
  console.log(req.user);
  console.log(req.body);
  try {
    // const {
    //   tanggal_mulai_izin,
    //   tanggal_selesai_izin,
    //   alasan_izin,
    //   total_hari_izin,
    // } = req.body;

    const result = await prisma.izin.create({
      data: {
        id_user: req.user.id_user,
        ...req.body,
      },
    });
    if (result) {
      res.status(201).json({ message: "Izin baru berhasil dibuat", result });
    } else {
      res.status(400);
      throw new Error("Izin tidak valid");
    }
  } catch (error) {
    next(error);
  }
});

const updateIzin = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      tanggal_mulai_izin,
      tanggal_selesai_izin,
      alasan_izin,
      total_hari_izin,
    } = req.body;

    const existingIzin = await prisma.izin.findUnique({
      where: {
        id_izin: parseInt(id),
      },
    });
    if (!existingIzin) {
      res.status(404);
      throw new Error("Izin tidak ditemukan");
    }

    const put = await prisma.izin.update({
      where: { id_izin: parseInt(id) },
      data: {
        tanggal_mulai_izin:
          tanggal_mulai_izin || existingIzin.tanggal_mulai_izin,
        tanggal_selesai_izin:
          tanggal_selesai_izin || existingIzin.tanggal_selesai_izin,
        alasan_izin: alasan_izin || existingIzin.alasan_izin,
        total_hari_izin: total_hari_izin,
      },
    });
    res.status(200).json({ message: "succes update izin", put });
  } catch (error) {
    next(error);
  }
});

const getIzin = asyncHandler(async (req, res, next) => {
  try {
    const izin = await prisma.user.findUnique({
      where: { id_user: req.user.id_user },
      select: {
        Izin: {
          orderBy: { id_izin: "desc" },
        },
      },
    });

    if (!izin) {
      res.status(404);
      throw new Error("Data izin tidak ditemukan");
    }

    res.status(200).json(izin);
  } catch (error) {
    next(error);
  }
});

module.exports = { createIzin, updateIzin, getIzin };
