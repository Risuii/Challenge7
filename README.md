# Referensi Challenge Chapter 7

Dibuat dengan ExpressJS, Sequelize, Postgres, dan PassportJW

### Goal

* Program ini bertujuan untuk membuat fungsi register & login
* Register hanya dapat dilakukan oleh `username` yang belum terdaftar dan `role` PlayerUser atapun SuperAdmin.
* Akses ke API wajib menggunakan JWT di Header
* User dengan Role PlayerUser dapat membuat Room untuk main
* User dengan Role PlayerUser dapat main di Room dengan jumlah maksimal 2 orang dan masing-masing mendapat giliran 3x

### Fungsional
* Ketika mengakses route `/auth/register` dengan metode POST dengan request body `username`, `password` dan `role`, user akan ditambahkan ke tabel `user_games`.
* Ketika mengakses route `/auth/login` dengan metode POST dengan request body `usernam` dan `passord`, user akan diautentikasi berdasar tabel `user_games` dan akan diberikan token JWT.
* Ketika mengakses route `/room/` dengan metode POST dengan request body `name`, room baru akan ditambahkan ke tabel `rooms`.
* Ketika mengakses route `/fight/:id` dengan metode POST dengan request body `choice`, data room akan diupdate & jika permainan sudah selesai akan menambah data ke tabel `user_game_histories`.

### Cara menggunakan



1. Install module yang dibutuhkan

```
npm install
```

2. Edit `config/config.json`

3. Buat database (perintah ini hanya berlaku di project ini karena sudah menggunakan scripts package.json)

```
npm run sequelize -- db:create
```

4. Migrasikan tabel (perintah ini hanya berlaku di project ini karena sudah menggunakan scripts package.json)

```
npm run sequelize -- db:migrate
```

5. Jalankan program

```
node index.js
```
