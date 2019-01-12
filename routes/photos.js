var express = require('express');
var router = express.Router();
var updatePhoto = require('../services/database');
var fs = require('fs');

router.put('/:id', function (req, res) {
	let emptyFieldsInReq = !Object.keys(req.body).length;
	let justOneFileInReq = !Array.isArray(photo);
	let photo = req.files.photo;
	if (req.files.photo && justOneFileInReq && emptyFieldsInReq) {
		updatePhoto(req.params.id, fs.readFileSync(photo.file,'base64'));
		res.status(200).json({'status': 'Photo was successfully updated'});
	} else {
		res.status(500).json({'Error': 'Invalid input data format'})
	}
});

module.exports = router;
