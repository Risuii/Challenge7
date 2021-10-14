// import passport
const passport = require('passport');

// import strategy & rename it as jwtstrategy & import extractjwt
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

// import user model
const { UserGame } = require('../models');

// option ini akan digunakan dalam passport 
const options = {
  // mengambil jwt dari request header bernama authorization
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),

  secretOrKey: 'Ini rahasia ga boleh disebar-sebar',
}

// buat strategy jwt yg digunakan & atur optionnya
passport.use(new JwtStrategy(options, async (payload, done) => {
  try {
    // setelah membaca jwt, cari user berdasar id ke dalam tabel user
    const user = await UserGame.findByPk(payload.id);

    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));

module.exports = passport;