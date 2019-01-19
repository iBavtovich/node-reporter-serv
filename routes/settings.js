let express = require('express');
let passport = require('passport');
const dataSyncAdapter = require('../services/dataSyncService');
const validateSchema = require('../validators/validator');

let router = express.Router();

router.put('/', validateSchema('update-settings'), passport.authenticate('bearer', { session: false }), function (req, res) {
	let userId = req.user.id;
	dataSyncAdapter.updateSettings(userId, req.body.settings).then(function (result) {
		switch (result) {
			case 200:
				res.status(result).json({message: 'Settings was successfully updated'});
				break;
			case 201:
				res.status(200).json({message: 'Settings was successfully updated'});
				break;
			case 409:
				res.status(result).json({error: 'Please try update settings again'});
				break;
			default:
				res.status(500).json({error: 'Update was failed with unknown error'});
		}
	});
});

router.get('/', passport.authenticate('bearer', { session: false }), function (req, res) {
	let userId = req.user.id;
	dataSyncAdapter.getSettingsForUser(userId).then(function (result) {
		res.json(result);
	});
});

module.exports = router;
