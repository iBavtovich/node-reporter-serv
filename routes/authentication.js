let TokenGenerator = require('uuid-token-generator');
let express = require('express');
let userService = require('../services/userService');
let passport = require('passport');
let app = require('../app');

let tokgen = new TokenGenerator(256, TokenGenerator.BASE62);
let router = express.Router();

router.post('/', passport.authenticate('local', { session: false }),
	function(req, res) {
		let token = userService.getTokenByUserId(req.user.id);

		if (token === undefined) {
			token = tokgen.generate();
			userService.updateUserToken(req.user.id, token);
		}

		res.json({token: token });
	});

module.exports = router;