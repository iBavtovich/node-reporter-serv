var passport = require('passport');
let express = require('express');
var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var userService = require('./userService');

passport.use(new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		session: false
	}, function (username, password, done) {
		let user = userService.getUserByUsername(username);
		if (user === undefined || user.password !== password) {
			done(null, false, "Bad credentials");
		} else {
			done(null, user);
		}
	}
));

passport.use(new BearerStrategy(
	function(token, done) {
		let isValid = userService.isValidToken(token);
		if (isValid) {
			done(null, true);
		} else {
			done(null, false, "Invalid token");
		}
	}
));

app.use(passport.initialize());

module.exports = app;