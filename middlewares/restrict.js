// import pengaturan module passport yang dibuat
const passport = require('../lib/passport');

// export fungsi bawaan passport sebagai middleware
module.exports = passport.authenticate('jwt', {
  session: false
});