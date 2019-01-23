let express = require('express');
let passport = require('passport');
const dataSyncAdapter = require('../services/dataSyncService');
const validateSchema = require('../validators/validator');

let router = express.Router();

/**
 * @typedef ChangeReportParameter
 * @property {string} id.required
 * @property {integer} value.required
 */

/**
 * @typedef ChangeReportSetting
 * @property {string} report_name - Name of report
 * @property {Array.<ChangeReportParameter>} parameters - parameters
 */

/**
 * @typedef ChangeSettings
 * @property {Array.<ChangeReportSetting>} settings.required
 */

/**
 * @route PUT /settings
 * @group Settings Service - Operations for receiving / updating settings from / to Yandex DataSync
 * @consumes application/json
 * @produces application/json
 * @param {ChangeSettings.model} settings.body.required - list of settings to be set
 * @returns {json} 200 - Result
 * @returns {Error} 400 - Invalid format of changes
 * @returns {Error} 401 - Invalid token
 * @returns {Error} 409 - Database was updated earlier
 * @returns {Error} 500 - Unexpected error
 * @security bearerAuth
 */
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
			case 400:
				res.status(400).json({error: 'Invalid format of changes'});
				break;
			default:
				res.status(500).json({error: 'Update was failed with unknown error'});
		}
	});
});

/**
 * @typedef ReportParameter
 * @property {string} id
 * @property {integer} value
 */

/**
 * @typedef ReportSetting
 * @property {string} report_name - Name of report
 * @property {Array.<ReportParameter>} parameters - parameters
 */

/**
 * @typedef Settings
 * @property {Array.<ReportSetting>} settings
 */

/**
 * @route GET /settings
 * @group Settings Service - Operations for receiving / updating settings from / to Yandex DataSync
 * @produces application/json
 * @returns {Settings.model} 200 - Result
 * @returns {Error} 401 - Invalid token
 * @returns {json}  default - Unexpected error
 * @security bearerAuth
 */
router.get('/', passport.authenticate('bearer', { session: false }), function (req, res) {
	let userId = req.user.id;
	dataSyncAdapter.getSettingsForUser(userId).then(function (result) {
		res.json(result);
	});
});

module.exports = router;
