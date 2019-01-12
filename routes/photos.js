var express = require('express');
var Busboy = require('busboy');
var router = express.Router();
var updatePhoto = require('../services/database');
var concat = require('concat-stream')


router.put('/:id', function (req, res) {
	var busboy = new Busboy({headers: req.headers});

	busboy.on('file', function (filename, file) {
		if (!res._headerSent && filename === 'photo') {
			file.pipe(concat(function (fileBuffer) {
				updatePhoto(req.params.id, fileBuffer.toString('base64'));
			}));

		} else {
			if (!res._headerSent) {
				res.status(500).json({'Error': 'Invalid data format'})
			}
		}
	});

	busboy.on('field', function () {
		if (!res._headerSent) {
			res.status(500).json({'Error': 'Invalid data format'})
		}
	});

	busboy.on('finish', function () {
		if (!res._headerSent) {
			res.status(200).json({'status': 'Photo was successfully updated'});
		}
	});

	req.pipe(busboy);
});

module.exports = router;
