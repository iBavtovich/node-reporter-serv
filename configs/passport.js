var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var userService = require('../services/userService');

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
		let user = userService.getUserIfTokenValid(token);
		if (user === undefined) {
			done(null, false, "Invalid token");
		} else {
			done(null, user);
		}
	}
));
