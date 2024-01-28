const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const validator = require("validator");
const fs = require("fs");
require("dotenv").config();

// @desc Get all users
// @route GET /api/users
// @acces private
const getUsers = async (req, res, next) => {
  console.log(req.user.role);
  try {
    // validasi hanya admin
    if (req.user.role === "admin") {
      const users = await prisma.user.findMany({});

      res.status(200).json({ users });
    } else {
      res.status(403);
      throw new Error("hanya admin yang bisa melakukan hal tersebut");
    }
  } catch (err) {
    next(err);
  }
};

// @desc Get user by id
// @route GET /api/users/:id
// @acces public
const getUserById = async (req, res) => {
  const { id } = req.params;

  // Cek apakah ada id yang terdaftar atau tidak
  const existingUser = await prisma.user.findUnique({
    where: {
      id_user: id,
    },
  });
  if (!existingUser) {
    return res.status(404).json({ error: "User tidak di temukan" });
  }

  const user = await prisma.user.findFirst({
    where: { id_user: id },
    include: {
      Absensi: true,
      _count: true,
    },
  });

  res.status(200).json(user);
};

// @desc Create a user
// @route POST /api/users/create
// @acces public
const createUser = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  console.log(req.files);
  let foto_profil;
  try {
    const {
      id_user,
      password_hash,
      nama_lengkap,
      jenis_kelamin,
      email,
      no_hp,
      status_pernikahan,
      role,
    } = req.body;

    // File foto
    if (req.files && req.files.length > 0) {
      // Jika ada, simpan path foto profil
      foto_profil = req.files[0].path;
      console.log("foto masuk user : ", foto_profil);
    }

    // cek ada yang kosong
    if (!id_user || !password_hash) {
      res.status(400);
      throw new Error("Tidak boleh ada bidang yang kosong");
    }

    // cek apakah user sudah terdaftar
    const userAvailable = await prisma.user.findUnique({
      where: {
        id_user: id_user,
      },
    });
    if (userAvailable) {
      res.status(400);
      throw new Error("User sudah terdaftar");
    }

    //konversi teks ke boolean
    const booleanJk = jenis_kelamin?.toLowerCase?.() === "true";
    const booleanSP = status_pernikahan?.toLowerCase?.() === "true";
    // console.log(booleanJk, booleanSP);

    // Hash password
    const hashedPassword = await bcrypt.hash(password_hash, 10);
    console.log("Hashed password : ", hashedPassword);

    // validasi email & no hp
    if (!validator.isEmail(email)) {
      res.status(400);
      throw new Error("Email tidak valid");
    }
    if (!validator.isMobilePhone(no_hp, "id-ID")) {
      res.status(400);
      throw new Error("Nomor handphone tidak valid");
    }

    const result = await prisma.user.create({
      data: {
        id_user,
        password_hash: hashedPassword,
        nama_lengkap,
        jenis_kelamin: booleanJk,
        email,
        no_hp,
        foto_profil: foto_profil,
        status_pernikahan: booleanSP,
        role: role || "user", // Default role untuk user jika tidak di berikan role
      },
    });

    if (result) {
      res
        .status(201)
        .json({ message: "User baru berhasil dibuat", result: result });
    } else {
      res.status(400);
      throw new Error("User tidak valid");
    }
  } catch (err) {
    // Jika ada error maka gagal upload foto ke folder uploads
    if (foto_profil) {
      fs.unlinkSync(foto_profil);
    }
    next(err);
  }
});

// @desc Update a user
// @route PUT /api/users/:id
// @acces public
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { password, role, nama_lengkap } = req.body;

  // Cek apakah ada id yang terdaftar atau tidak
  const existingUser = await prisma.user.findUnique({
    where: {
      id_user: id,
    },
  });
  if (!existingUser) {
    return res.status(404).json({ error: "User tidak di temukan" });
  }

  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
  const post = await prisma.user.update({
    where: { id_user: id },
    data: {
      password: hashedPassword || existingUser.password,
      role: role || existingUser.role,
      nama_lengkap: nama_lengkap || existingUser.nama_lengkap,
    },
  });

  res.status(200).json({ post });
});

// @desc Delete a user
// @route DELETE /api/users/:id
// @acces public
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id_user: id,
    },
  });
  if (!user) {
    res.status(404);
    throw new Error("User dengan id tersebut tidak ditemukan");
  }

  try {
    // Hapus data Absensi terkait dengan user
    await prisma.absensi.deleteMany({
      where: {
        id_user: user.id_user,
      },
    });

    // Setelah data Absensi dihapus, baru hapus user
    const deletedUser = await prisma.user.delete({
      where: {
        id_user: user.id_user,
      },
    });

    res.status(200).json({
      message: `User dengan ID ${id} dan data terkait dihapus`,
      deletedUser,
    });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghapus user" });
  }

  res
    .status(200)
    .json({ message: "delete contact dengan id : " + id, deleteUser });
});

// @desc Login a user
// @route POST /api/users/login
// @acces public
const loginUser = asyncHandler(async (req, res, next) => {
  try {
    const { id_user, password_hash } = req.body;

    if (!id_user || !password_hash) {
      res.status(400);
      throw new Error("Semua bidang tidak boleh kosong");
    }

    const user = await prisma.user.findUnique({
      where: { id_user },
    });

    // bandingkan password dengan yang di hash
    if (user && (await bcrypt.compare(password_hash, user.password_hash))) {
      const accessToken = jwt.sign(
        {
          user: {
            id_user: user.id_user,
            nama_lengkap: user.nama_lengkap,
            role: user.role,
          },
        },
        process.env.ACCES_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      res.status(200).json({ accessToken, id_user });
    } else if (!user) {
      res.status(404);
      throw new Error("user tidak ditemukan");
    } else {
      res.status(401);
      throw new Error("Id user atau password salah");
    }
  } catch (err) {
    next(err);
  }
});

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
};
