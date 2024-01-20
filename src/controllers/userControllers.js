const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

// @desc Get all users
// @route GET /api/users
// @acces public
const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error });
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

  res.status(200).json({ user });
};

// @desc Create a user
// @route POST /api/users
// @acces public
const createUser = asyncHandler(async (req, res) => {
  const { id_user, password, role, nama_lengkap } = req.body;
  // cek ada yang kosong
  if (!id_user || !password) {
    res.status(400);
    throw new Error("Tidak boleh ada bidang yang kosong");
  }

  // cek apakah user sudah terdaftar
  const userAvailable = await prisma.user.findFirst({
    where: {
      id_user: id_user,
    },
  });
  if (userAvailable) {
    res.status(400);
    throw new Error("User sudah terdaftar");
  }

  // encrypt password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed password : ", hashedPassword);

  const result = await prisma.user.create({
    data: {
      id_user,
      password: hashedPassword,
      role: role || "USER", // Default role untuk USER jika tidak di berikan role
      nama_lengkap,
    },
  });

  if (result) {
    res
      .status(201)
      .json({ message: "User baru berhasil dibuat", result: result });
    console.log("Request body is : ", result);
  } else {
    res.status(400);
    throw new Error("User tidak valid");
  }
});

// @desc Update a user
// @route PUT /api/users/:id
// @acces public
const updateUser = asyncHandler(async (req, res) => {
  console.log(req.body);
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

  const hashedPassword = await bcrypt.hash(password, 10);
  const post = await prisma.user.update({
    where: { id_user: id },
    data: { password: hashedPassword, role, nama_lengkap },
  });

  res.status(200).json({ post });
});

// @desc Delete a user
// @route DELETE /api/users/:id
// @acces public
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleteUser = await prisma.user.delete({
    where: {
      id_user: id,
    },
  });

  res
    .status(200)
    .json({ message: "delete contact dengan id : " + id, deleteUser });
});

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
