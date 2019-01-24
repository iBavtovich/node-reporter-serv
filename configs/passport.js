/* eslint indent: "off" */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const userService = require('../services/userService');

passport.use(new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		session: false
	}, (username, password, done) => {
		const user = userService.getUserByUsername(username);
		if (user === undefined || user.password !== password) {
			done(null, false, 'Bad credentials');
		} else {
			done(null, user);
		}
	}
));

passport.use(new BearerStrategy(
	(token, done) => {
		const user = userService.getUserIfTokenValid(token);
		if (user === undefined) {
			done(null, false, 'Invalid token');
		} else {
			done(null, user);
		}
	}
));
