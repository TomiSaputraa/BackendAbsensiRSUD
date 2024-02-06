const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const validator = require("validator");
const fs = require("fs");
const { log } = require("console");
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
const getUserById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    // Cek apakah ada id yang terdaftar atau tidak
    const existingUser = await prisma.user.findUnique({
      where: {
        id_user: id,
      },
    });
    if (!existingUser) {
      res.status(404);
      throw new Error("User tidak di temukan");
    }

    const user = await prisma.user.findUnique({
      where: { id_user: id },
    });

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

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
      jabatan,
      ruangan,
      grup,
      jenis_kelamin,
      email,
      no_hp,
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
        jabatan,
        ruangan,
        grup,
        jenis_kelamin: jenis_kelamin,
        email,
        no_hp,
        foto_profil: foto_profil,
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
const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let foto_profil;

  console.log("req body : ", req.body);
  console.log("req files: ", req.files);

  try {
    const {
      id_user,
      password_hash,
      nama_lengkap,
      jabatan,
      ruangan,
      grup,
      jenis_kelamin,
      email,
      no_hp,
      role,
    } = req.body;

    // console.log(req.files);

    console.log({ foto_profil });

    // Cek apakah ada id yang terdaftar atau tidak
    const existingUser = await prisma.user.findUnique({
      where: {
        id_user: id,
      },
    });

    // pengecekan user apakah tersedia
    if (!existingUser) {
      res.status(404);
      throw new Error("User tidak ditemukan");
    }

    // hash password
    const hashedPassword = password_hash
      ? await bcrypt.hash(password_hash, 10)
      : undefined;

    // validasi email & no hp
    if (!validator.isEmail(email || existingUser.email)) {
      res.status(400);
      throw new Error("Email tidak valid");
    }
    if (!validator.isMobilePhone(no_hp || existingUser.no_hp, "id-ID")) {
      res.status(400);
      throw new Error("Nomor handphone tidak valid");
    }

    // File foto
    if (req.files && req.files.length > 0) {
      // Jika ada, simpan path foto profil
      foto_profil = req.files[0].path;
      console.log("foto masuk user : ", foto_profil);

      // Hapus foto profil lama (jika ada)
      if (existingUser.foto_profil) {
        fs.unlinkSync(existingUser.foto_profil);
      }
    } else {
      foto_profil = existingUser.foto_profil;
    }

    const result = await prisma.user.update({
      where: { id_user: id },
      data: {
        id_user: id_user || existingUser.id_user,
        password_hash: hashedPassword || existingUser.password_hash,
        nama_lengkap: nama_lengkap || existingUser.nama_lengkap,
        jabatan: jabatan || existingUser.jabatan,
        ruangan: ruangan || existingUser.ruangan,
        grup: grup || existingUser.grup,
        jenis_kelamin: jenis_kelamin || existingUser.jenis_kelamin,
        email: email || existingUser.email,
        no_hp: no_hp || existingUser.no_hp,
        foto_profil: foto_profil,
        role: role || existingUser.role,
      },
    });

    res.status(200).json({ message: "Succes update data user", result });
  } catch (err) {
    // Jika ada error maka gagal upload foto ke folder uploads
    if (foto_profil && foto_profil !== existingUser.foto_profil) {
      fs.unlinkSync(foto_profil);
    }
    next(err);
  }
});

// @desc Delete a user
// @route DELETE /api/users/:id
// @acces public
const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    // validasi hanya admin
    if (req.user.role === "admin") {
      const user = await prisma.user.findUnique({
        where: {
          id_user: id,
        },
      });
      if (!user) {
        res.status(404);
        throw new Error("User dengan id tersebut tidak ditemukan");
      }
      // Nonaktifkan foreign key
      await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS=0`;

      // Hapus user
      const deletedUser = await prisma.user.delete({
        where: {
          id_user: id,
        },
      });

      if (deletedUser) {
        // hapus foto profil
        const fileFoto = user.foto_profil;
        fs.unlinkSync(fileFoto);

        // Aktifkan kembali foreign key
        await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS=1`;

        res.status(200).json({
          message: `User dengan ID ${id} dan data terkait dihapus`,
          deletedUser,
        });
      }
    } else {
      res.status(403);
      throw new Error("hanya admin yang bisa melakukan hal tersebut");
    }
  } catch (err) {
    next(err);
  }
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
        { expiresIn: "40m" }
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
