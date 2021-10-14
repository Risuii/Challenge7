// import express
const express = require('express');
const app = express();

// import passport
const passport = require('./lib/passport');

// get port from env, if env not set, use 3000
const port =  process.env.port || 3000;

// import routes
const router = require('./routes');

// use middleware for request parsing
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// use passport for jwt auth
app.use(passport.initialize());

// use route
app.use(router);

// run app in port specified
app.listen(port, () => {
  console.log(`App is running in http://localhost:${port}`);
});
