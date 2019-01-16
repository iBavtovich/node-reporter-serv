var express = require('express');
var router = express.Router();
const dataSyncAdapter = require('../services/dataSyncService');
const validateSchema = require('../validators/validator');

router.put('/', validateSchema('update-settings'), function (req, res) {
	dataSyncAdapter.updateSettings(1, req.body.settings).then(function (result) {
		switch (result) {
			case 200:
				res.status(result).json({'message': 'Settings was successfully updated'});
				break;
			case 201:
				res.status(200).json({'message': 'Settings was successfully updated'});
				break;
			case 409:
				res.status(result).json({'error': 'Please try update settings again'});
				break;
			default:
				res.status(500).json({'error': 'Update was failed with unknown error'});
		}
	});
});

router.get('/', function (req, res) {
	dataSyncAdapter.getSettingsForUser(1).then(function (result) {
		res.json(result);
	});
});

module.exports = router;
