const fs = require('fs');
const express = require('express');
const passport = require('passport');
const updatePhoto = require('../services/lowDBService');

const router = express.Router();

/**
 * @route PUT /photos/{id}
 * @group Photo Service - Operations for uploading photos
 * @param {string} id.path.required - user id
 * @param {file} photo.formData - binary file
 * @consumes application/x-www-form-urlencoded
 * @produces application/json
 * @returns {json} 200 - Result
 * @returns {Error} 401 - Invalid token
 * @returns {json}  default - Unexpected error
 * @security bearerAuth
 */
router.put('/:id', passport.authenticate('bearer', {session: false}), (req, res) => {
	const emptyFieldsInReq = !Object.keys(req.body).length;
	const {photo} = req.files;
	const justOneFileInReq = !Array.isArray(photo);
	if (req.files.photo && justOneFileInReq && emptyFieldsInReq) {
		updatePhoto(req.params.id, fs.readFileSync(photo.file, 'base64'));
		res.status(200).json({status: 'Photo was successfully updated'});
	} else {
		res.status(500).json({error: 'Invalid input data format'});
	}
});

module.exports = router;
