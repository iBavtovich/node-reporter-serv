let TokenGenerator = require('uuid-token-generator');
let passport = require('passport');
let express = require('express');
let userService = require('../services/userService');
const validateSchema = require('../validators/validator');

let tokgen = new TokenGenerator(256, TokenGenerator.BASE62);
let router = express.Router();

router.post('/', validateSchema("auth-user"), passport.authenticate('local', { session: false }),
	function(req, res) {

		let token = userService.getTokenByUserId(req.user.id);

		if (token === undefined) {
			token = tokgen.generate();
			userService.updateUserToken(req.user.id, token);
		}

		res.json({token: token });
	});

module.exports = router;