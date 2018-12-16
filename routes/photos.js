var express = require('express');
var router = express.Router();
var updatePhoto = require('../services/database');


router.put('/:id', function(req, res) {
  console.log("try to upload photo");
  var updatePhoto1 = updatePhoto(req.params.id, req.body);
  console.log(updatePhoto1);
  res.end();
});

module.exports = router;
