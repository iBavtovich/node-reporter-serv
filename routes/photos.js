let fs = require('fs');
let express = require('express');
let updatePhoto = require('../services/lowDBService');
let passport = require('passport');

let router = express.Router();

router.put('/:id', passport.authenticate('bearer', { session: false }), function (req, res) {
	const emptyFieldsInReq = !Object.keys(req.body).length;
	const photo = req.files.photo;
	const justOneFileInReq = !Array.isArray(photo);
	if (req.files.photo && justOneFileInReq && emptyFieldsInReq) {
		updatePhoto(req.params.id, fs.readFileSync(photo.file, 'base64'));
		res.status(200).json({status: 'Photo was successfully updated'});
	} else {
		res.status(500).json({error: 'Invalid input data format'});
	}
});

module.exports = router;
