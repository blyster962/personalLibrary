'use strict';

const path = require('path');
const log = require('debug')('notes:router-users');
const error = require('debug')('notes:error');
const express = require('express');
const router = express.Router();
exports.router = router;

const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const userModel = require(process.env.USERS_MODEL
                          ? path.join('..', process.env.USERS_MODEL)
                          : '../models/users-rest');

exports.initPassport = function(app) {
  app.use(passport.initialize());
  app.use(passport.session());
};

exports.ensureAuthenticated = function(req, res, next) {
  // req.user is set by Passport in the deserialize function
  if (req.user) next();
  else res.redirect('/users/login');
};

router.get('/login', function(req, res, next) {
  // log(util.inspect(req));
  res.render('login', {
    title: 'Login',
    user: req.user
  });
});

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',    // SUCCESS: Go to the home page
    failureRedirect: 'login' // FAIL: Go to /user/login
  })
);

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

passport.use(new localStrategy(
  function(username, password, done) {
    usersModel.userPasswordCheck(username, password)
    .then(check => {
      if (check.check) {
        done(null, { id: check.username, username: check.username });
      } else {
        done(null, false, check.message);
      }
      return check;
    })
    .catch(err => done(err));
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  usersModel.find(username)
  .then(user => done(null, user))
  .catch(err => done(err));
});
