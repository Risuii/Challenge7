// import models
const { Room, UserGameHistory } = require('../models');

// set max game 3
const MAX_GAME = 3;

// set game possible choice
const ROCK = 'R';
const PAPER = 'P';
const SCISSOR = 'S';

// set possible game output
const WIN = 'WIN';
const LOSE = 'LOSE';
const DRAW = 'DRAW';


// method untuk cek akses
const checkUserRole = (user) => {
  // ambil role dari user
  const { role } = user;

  // cek apakah user memiliki hak user
  if (role !== 'PlayerUser') {
    return false;
  }

  return true;
}

// method untuk cek semua user sudah memilih 3x
const checkGameComplete = (room) => {
  // cek apakah room sudah pernah dimainkan oleh 2 player
  if (room.choice1 && room.choice2) {

    // cek apakah sudah pernah dimainkan sebanyak masing-masing 3x (.length tidak bisa digunakan jika kolom belum terisi, jadi pengecekan ini harus di if terpisah)
    if (room.choice1.length === MAX_GAME && room.choice2.length === MAX_GAME) {
      return true
    }

  }

  return false;
}

// method untuk menambahkan player ke tabel
const updatePlayer = async (room, userId) => {
  // ambil id dari room sebagai roomId;
  const { id: roomId } = room;

  // siapkan variable untuk menyimpan player yg kosong
  let isFirstEmpty = false
  let isSecondEmpty = false;

  // siapkan variable untuk menyimpan status player;
  let isFirstPlayer = false;
  let isSecondPlayer = false;

  // cek apakah user sudah terdaftar atau belum
  if (room.player1 === userId) {

    // jika user id sama dengan id player1, berarti user ini adalah player1
    isFirstPlayer = true;

  } else if (room.player2 === userId) {

    // jika user id sama dengan id player2, berarti user ini adalah player2
    isSecondPlayer = true;

  } else if (room.player1 === null) {

    // jika player1 belum terdaftar, berarti user ini akan kita jadikan player 1
    isFirstEmpty = true;
    isFirstPlayer = true;

  } else if (room.player2 === null) {

    // jika player1 sudah terdaftar, tapi player 2 belum terdaftar, berarti user ini akan kita jadikan player 2
    isSecondEmpty = true;
    isSecondPlayer = true;

  } else if (room.player1 !== userId && room.player2 !== userId) {

    // jika player 1 & 2 sudah terdaftar tapi user ini bukan player tersebut, tolak user
    return { error: 'Room already full' };

  }

  // tambah user sebagai player 1
  if (isFirstEmpty) {
    try {
      await Room.update(
        { player1: userId },
        { where: { id: roomId } }
      );
    } catch (err) {
      return { error: err };
    }
  }

  // tambah user sebagai player 2 
  if (isSecondEmpty) {
    try {
      await Room.update(
        { player2: userId },
        { where: { id: roomId } }
      );
    } catch (err) {
      return { error: err };
    }
  }

  return {
    isFirstEmpty,
    isSecondEmpty,
    isFirstPlayer,
    isSecondPlayer,
    error: null
  }
}

// method untuk memastikan user hanya boleh memilih setelah player lain sudah memilih
const checkPlayerTurn = async (room, isFirstPlayer, isSecondPlayer) => {
  // ambil pilihan user dari room
  const { choice1, choice2 } = room;

  // pastikan user bermain secara berurutan

  // jika keduanya sudah sama sama memilih
  if (choice1 && choice2) {
    // jika keduanya sudah sama sama memilih
    if (isFirstPlayer && choice1.length > choice2.length) {
      // jika user adalah player 1 dan sudah memilih lebih banyak dari player 2
      return false;
    } else if (isSecondPlayer && choice2.length > choice1.length) {
      // jika user adalah player 2 dan sudah memilih lebih banyak dari player 2
      return false;
    }
  } else if (isFirstPlayer && choice1 && !choice2) {
    // jika user adalah player 1, sudah pernah memilih, tapi player 2 belum pernah
    return false;
  } else if (isSecondPlayer && choice2 && !choice1) {
    // jika user adalah player 2, sudah pernah memilih, tapi player 1 belum pernah
    return false;
  }

  return true;
}

// method untuk menambahkan pilihan ke tabel
const processGame = async (room, choice, isFirstPlayer, isSecondPlayer) => {
  // ambil id dari room sebagai roomId;
  const { id: roomId } = room;

  // update pilihan player 1
  if (isFirstPlayer) {

    // tambah pilihan ke choice1
    try {
      let updatedChoice = [];

      if (room.choice1) {
        room.choice1.push(choice);
        updatedChoice = [...room.choice1];
      } else if (!room.choice1) {
        updatedChoice.push(choice);
      }

      await Room.update(
        { choice1: updatedChoice },
        { where: { id: roomId } }
      );
    } catch (err) {
      return { error: err };
    }
  }

  // update pilihan player 2
  if (isSecondPlayer) {

    // tambah pilihan ke choice2
    try {
      let updatedChoice = [];

      if (room.choice2) {
        room.choice2.push(choice);
        updatedChoice = [...room.choice2];
      } else if (!room.choice2) {
        updatedChoice.push(choice);
      }

      await Room.update(
        { choice2: updatedChoice },
        { where: { id: roomId } }
      );
    } catch (err) {
      return { error: err };
    }
  }

  return {
    error: null
  }
}

// method untuk membandingkan pilihan
const checkChoice = (choice1, choice2) => {
  const result = {
    player1: '',
    player2: '',
  };

  if (choice1 === choice2) {
    result.player1 = DRAW;
    result.player2 = DRAW;

    return result;
  }

  if (choice1 === ROCK && choice2 === PAPER) {
    result.player1 = LOSE;
    result.player2 = WIN;

    return result;
  }

  if (choice1 === ROCK && choice2 === SCISSOR) {
    result.player1 = WIN;
    result.player2 = LOSE;

    return result;
  }

  if (choice1 === PAPER && choice2 === SCISSOR) {
    result.player1 = LOSE;
    result.player2 = WIN;

    return result;
  }

  if (choice1 === PAPER && choice2 === ROCK) {
    result.player1 = WIN;
    result.player2 = LOSE;

    return result;
  }

  if (choice1 === SCISSOR && choice2 === ROCK) {
    result.player1 = LOSE;
    result.player2 = WIN;

    return result;
  }

  if (choice1 === SCISSOR && choice2 === PAPER) {
    result.player1 = WIN;
    result.player2 = LOSE;

    return result;
  }
}

// method untuk menghitung hasil akhir
const checkFinalResult = (playerResult) => {
  const result = {
    player1: '',
    player2: '',
  };

  // siapkan variable penghitung jumlah kemenangan
  let player1WinCount = 0;
  let player2WinCount = 0;

  // hitung dengan perulangan
  for (let index = 0; index < MAX_GAME; index++) {

    // jika player 1 menang, tambah jumlah kemenangan
    if (playerResult.player1[index] === WIN) {
      player1WinCount++;
    }

    // jika player 2 menang, tambah jumlah kemenangan
    if (playerResult.player2[index] === WIN) {
      player2WinCount++;
    }
  }

  if (player1WinCount === player2WinCount) {
    result.player1 = DRAW;
    result.player2 = DRAW;

    return result;
  }

  if (player1WinCount > player2WinCount) {
    result.player1 = WIN;
    result.player2 = LOSE;

    return result;
  }

  if (player1WinCount < player2WinCount) {
    result.player1 = LOSE;
    result.player2 = WIN;

    return result;
  }
}

// method untuk menghitung permainan terakhir
const calculateFinal = async (updatedRoom) => {
  // ambil dari updatedRoom
  const { id: roomId, player1, player2, choice1, choice2 } = updatedRoom;

  // siapkan variable untuk kumpulkan hasil
  let playerResult = {
    player1: [],
    player2: [],
  };

  // lakukan perulangan untuk cek hasil
  for (let index = 0; index < MAX_GAME; index++) {
    const result = checkChoice(choice1[index], choice2[index]);

    playerResult.player1.push(result.player1);
    playerResult.player2.push(result.player2);
  }

  // siapkan variable untuk hasil akhir (tidak wajib, ditulis supaya jelas bentuk yg diharapkan)
  let finalResult = {
    player1: '',
    player2: ''
  }

  finalResult = checkFinalResult(playerResult);

  // tambahkan ke history
  try {
    await UserGameHistory.create({
      user_id: player1,
      room_id: roomId,
      result: finalResult.player1,
    });

    await UserGameHistory.create({
      user_id: player2,
      room_id: roomId,
      result: finalResult.player2,
    });
  } catch (err) {
    return { error: err };
  }

  return {
    finalResult,
    error: null
  };
}

// game controller
const game = async (req, res) => {
  // ambil pilihan user dari request body
  const { choice } = req.body;

  // ambil id room dari request param & ganti namanya menjadi roomId
  const { id: roomId } = req.params;

  // ambil id user dari request user (hasil passport) & ganti namanya menjadi userId
  const { id: userId } = req.user;

  // cek role menggunakan req.user hasil dari middleware restrict
  const isPlayer = checkUserRole(req.user);

  // jika hasilnya false, berarti role tidak memiliki hak akses di controller ini
  if (!isPlayer) {
    return res.json('Role is not allowed');
  }

  // cek apakah choice yg dipilih bukan R P S (yang diperbolehkan)
  if (choice !== ROCK && choice !== PAPER && choice !== SCISSOR) {
    return res.json('Invalid choice');
  }

  // siapkan variable room
  let room = {};

  try {
    // ambil room berdasar id
    room = await Room.findOne({
      where: { id: roomId }
    });
  } catch (err) {
    return res.json(err);
  }

  // cek apakah room tidak ditemukan
  if (!room) {
    return res.json('Room not found');
  }

  // cek apakah room sudah digunakan 2 player masing-masing 3 kali
  const isGameCompleted = checkGameComplete(room);

  if (isGameCompleted) {
    return res.json('Game already completed');
  }

  // cek apakah player merupakan player 1 atau player 2, jika belum terdaftar, update data roomo
  const { isFirstPlayer, isSecondPlayer, error: updateError } = await updatePlayer(room, userId);
  if (updateError) {
    return res.json(updateError);
  }

  // cek apakah player lain sudah memilih
  const isPlayerTurn = await checkPlayerTurn(room, isFirstPlayer, isSecondPlayer);
  if (!isPlayerTurn) {
    return res.json('Please wait for other player to choose');
  }

  // simpan pilihan player
  const { error: processError } = await processGame(room, choice, isFirstPlayer, isSecondPlayer);
  if (processError) {
    return res.json(processError);
  }

  // siapkan variable response;
  let response = {};

  // ambil data terbaru (method .update tidak memberikan return data)
  let updatedRoom = {};

  try {
    updatedRoom = await Room.findOne({
      where: { id: roomId }
    });

    // atur hasil ini sebagai response (jika bukan permainan terakhir, response ini yg akan digunakan) 
    response = { ...updatedRoom.dataValues };
  } catch (err) {
    return res.json(err);
  }

  // pastikan room sudah digunakan sebanyak 3x oleh masing-masing player
  const isLastGame = await checkGameComplete(updatedRoom);

  // jika permainan terakhir, hitung hasil & update tabel hasil
  if (isLastGame) {
    const { finalResult, error: finalError } = await calculateFinal(updatedRoom);
    if (finalError) {
      return res.json(finalError);
    }

    // buat hasil akhir
    response = {
      roomId,
      player1: finalResult.player1,
      player2: finalResult.player2,
    }
  }

  return res.json(response);
}

module.exports = {
  game
}