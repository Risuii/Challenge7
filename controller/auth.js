// import bcrypt untuk menyimpan & mengecek password dengan cara yg aman
const bcrypt = require('bcrypt');

// import jwt untuk membuat token
const jwt = require('jsonwebtoken');

const { UserGame } = require('../models');

// method untuk menyimpan password dalam bentuk hash
const encrypt = (password) => {
  return bcrypt.hashSync(password, 10);
}

// method untuk membandingkan password dalam bentuk hash & plain text
const checkPassword = (password, encryptedPassword,) => {
  return bcrypt.compareSync(password, encryptedPassword);
}

// method untuk membuat token jwt
const generateToken = (user) => {
  // Jangan memasukkan password ke dalam payload
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
  }

  // Rahasia ini nantinya kita pakai untuk memverifikasi apakah token ini benar-benar berasal dari aplikasi kita
  const rahasia = 'Ini rahasia ga boleh disebar-sebar';

  // Membuat token dari data-data diatas
  return jwt.sign(payload, rahasia);
}

// method untuk membuat response setelah register
const format = (user) => {
  const { id, username, role } = user
  return {
    id,
    username,
    role,
    accessToken: generateToken(user)
  }
}

// controller register
const register = async (req, res) => {
  // ambil username, password, dan role dari request body
  const { username, password, role } = req.body;

  // pastikan hanya PlayerUser atau SuperAdmin yang boleh dimasukkan sebagai role
  if (role !== 'PlayerUser' && role !== 'SuperAdmin') {
    return res.json('Role is not allowed');
  }

  try {
    // cek apakah user sudah ada
    const user = await UserGame.findOne({
      where: { username }
    });

    // jika user ditemukan
    if (user) {
      return res.json('User already registered!');
    }

  } catch (err) {
    return res.json(err);
  }

  try {
    // mengubah password menjadi hash
    const encryptedPassword = encrypt(password);

    // buat user di tabel
    const user = await UserGame.create({
      username,
      password: encryptedPassword,
      role
    });

    return res.json(user);

  } catch (err) {
    return res.json(err);
  }
}

// controller login
const login = async (req, res) => {
  // ambil username dan password dari request body
  const { username, password } = req.body;

  // siapkan variable penampung user
  let user = {};

  try {
    // cari user berdasar username
    user = await UserGame.findOne({
      where: { username }
    })
  } catch (err) {
    return res.json(err);
  }

  // cek apakah user tidak ditemukan
  if (!user) {
    return res.json('User not found!');
  }

  // bandingkan password dari request body dengan dari database
  const isPasswordValid = checkPassword(password, user.password);

  // jika tidak sesuai
  if (!isPasswordValid) {
    return res.json('Wrong Password');
  }

  // jika sesuai
  return res.json(format(user));

}

module.exports = {
  register,
  login,
}