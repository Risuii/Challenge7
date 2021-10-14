// import models
const { Room } = require('../models');

// method untuk cek akses
const checkUserRole = (user) => {
  // ambil role dari user
  const { role } = user;

  // cek apakah user memiliki hak user
  if (role !== 'PlayerUser'){
    return false;
  }

  return true;
}

// create room controller
const createRoom = async (req, res) => {
  // ambil name dari request body
  const { name } = req.body;

  // cek role menggunakan req.user hasil dari middleware restrict
  const isPlayer = checkUserRole(req.user);
  
  // jika hasilnya false, berarti role tidak memiliki hak akses di controller ini
  if(!isPlayer){
    return res.json('Role is not allowed');
  }

  try {
    // buat room dengan nama
    const room = await Room.create({
      name
    });

    // kirim hasil sebagai response
    return res.json(room);

  } catch (err) {
    return res.json(err);
  }
}

module.exports = {
  createRoom,
}