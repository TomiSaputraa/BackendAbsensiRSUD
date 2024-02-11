const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");

const createSakit = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  let bukti_foto;
  try {
    const {
      tanggal_mulai_sakit,
      tanggal_selesai_sakit,
      alasan_sakit,
      total_hari_sakit,
    } = req.body;

    if (req.files && req.files.length > 0) {
      bukti_foto = req.files[0].path;
      console.log("foto masuk : ", bukti_foto);
    }

    let total_sakit = parseInt(total_hari_sakit);

    const result = await prisma.sakit.create({
      data: {
        id_user: req.user.id_user,
        tanggal_mulai_sakit,
        tanggal_selesai_sakit,
        alasan_sakit,
        bukti_foto,
        total_hari_sakit: total_sakit,
      },
    });
    if (result) {
      res.status(201).json({ message: "Sakit baru berhasil dibuat", result });
    } else {
      res.status(400);
      throw new Error("Izin tidak valid");
    }
  } catch (error) {
    // Jika ada error maka gagal upload foto ke folder uploads
    if (bukti_foto) {
      fs.unlinkSync(bukti_foto);
    }
    next(error);
  }
});

const updateSakit = asyncHandler(async (req, res, next) => {
  let bukti_foto;
  try {
    const { id } = req.params;
    const {
      tanggal_mulai_sakit,
      tanggal_selesai_sakit,
      alasan_sakit,
      total_hari_sakit,
    } = req.body;

    const existingSakit = await prisma.sakit.findUnique({
      where: {
        id_sakit: parseInt(id),
      },
    });

    if (!existingSakit) {
      res.status(404);
      throw new Error("Sakit tidak ditemukan");
    }

    let total_sakit = parseInt(total_hari_sakit);

    // File foto
    if (req.files && req.files.length > 0) {
      // Jika ada, simpan path foto profil
      bukti_foto = req.files[0].path;
      console.log("foto masuk user : ", bukti_foto);

      // Hapus foto profil lama (jika ada)
      if (existingSakit.bukti_foto) {
        fs.unlinkSync(existingSakit.bukti_foto);
      }
    } else {
      bukti_foto = existingSakit.bukti_foto;
    }

    const update = await prisma.sakit.update({
      where: { id_sakit: parseInt(id) },
      data: {
        tanggal_mulai_sakit:
          tanggal_mulai_sakit || existingSakit.tanggal_mulai_sakit,
        tanggal_selesai_sakit: tanggal_selesai_sakit || tanggal_selesai_sakit,
        alasan_sakit: alasan_sakit || existingSakit.alasan_sakit,
        bukti_foto: bukti_foto || existingSakit.bukti_foto,
        total_hari_sakit: total_sakit || existingSakit.total_hari_sakit,
      },
    });
    res.status(200).json({ message: "Succes update data user", update });
  } catch (error) {
    // Jika ada error maka gagal upload foto ke folder uploads
    if (bukti_foto) {
      fs.unlinkSync(bukti_foto);
    }
    next(error);
  }
});

const getSakit = asyncHandler(async (req, res, next) => {
  console.log(req);
  try {
    const sakit = await prisma.user.findUnique({
      where: { id_user: req.user.id_user },
      select: {
        Sakit: {
          orderBy: { id_sakit: "desc" },
        },
      },
    });

    if (!sakit) {
      res.status(404);
      throw new Error("Data sakit tidak ditemuka");
    }

    res.status(200).json(sakit);
  } catch (error) {
    next(error);
  }
});

module.exports = { getSakit, createSakit, updateSakit };
