const TokenGenerator = require('uuid-token-generator');
const passport = require('passport');
const express = require('express');
const userService = require('../services/userService');
const validateSchema = require('../validators/validator');

const tokgen = new TokenGenerator(256, TokenGenerator.BASE62);
const router = express.Router();

/**
 * @typedef Token
 * @property {string} token
 */

/**
 * @typedef Credentials
 * @property {string} username.required
 * @property {string} password.required
 */

/**
 * @route POST /authenticate
 * @group Auth Service - Get token
 * @consumes application/json
 * @produces application/json
 * @param {Credentials.model} credentials.body.required - username and password
 * @returns {Token.model} 200 - token for requests
 * @returns {Error} 401 - Invalid credentials
 * @returns {Error} default - Unexpected error
 */
router.post('/', validateSchema('auth-user'), passport.authenticate('local', {session: false}), (req, res) => {
	let token = userService.getTokenByUserId(req.user.id);

	if (token === undefined) {
		token = tokgen.generate();
		userService.updateUserToken(req.user.id, token);
	}

	res.json({token: 'Bearer ' + token});
});

module.exports = router;
