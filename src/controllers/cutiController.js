const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getCuti = asyncHandler(async (req, res, next) => {
  try {
    const cuti = await prisma.user.findUnique({
      where: {
        id_user: req.user.id_user,
      },
      select: {
        Cuti: {
          orderBy: { id_cuti: "desc" },
        },
      },
    });

    if (!cuti) {
      res.status(404);
      throw new Error("Data cuti tidak ditemukan");
    }

    res.status(200).json(cuti);
  } catch (error) {
    next(error);
  }
});

const createCuti = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  try {
    const result = await prisma.cuti.create({
      data: {
        id_user: req.user.id_user,
        ...req.body,
      },
    });

    if (result) {
      res.status(201).json({ message: "Cuti baru berhasil dibuat", result });
    } else {
      res.status(400);
      throw new Error("Cuti tidak valid");
    }
  } catch (error) {
    next(error);
  }
});

const updateCuti = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      tanggal_mulai_cuti,
      tanggal_selesai_cuti,
      alasan_cuti,
      total_hari_cuti,
      status_cuti,
    } = req.body;

    const existingCuti = await prisma.cuti.findUnique({
      where: {
        id_cuti: parseInt(id),
      },
    });

    if (!existingCuti) {
      res.status(404);
      throw new Error("Cuti tidak ditemukan");
    }

    const put = await prisma.cuti.update({
      where: { id_cuti: parseInt(id) },
      data: {
        tanggal_mulai_cuti:
          tanggal_mulai_cuti || existingCuti.tanggal_mulai_cuti,
        tanggal_selesai_cuti:
          tanggal_selesai_cuti || existingCuti.tanggal_selesai_cuti,
        alasan_cuti: alasan_cuti || existingCuti.alasan_cuti,
        total_hari_cuti: total_hari_cuti || existingCuti.total_hari_cuti,
        status_cuti: status_cuti || existingCuti.status_cuti,
      },
    });
    res.status(200).json({ message: "Succes update Cuti", put });
  } catch (error) {
    next(error);
  }
});

module.exports = { getCuti, createCuti, updateCuti };
