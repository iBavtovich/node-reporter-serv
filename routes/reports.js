var express = require('express');
var parse = require('csv-parse');
var router = express.Router();
var getEmployees = require('../services/yandexDyskService');

router.get('/', function (req, res, next) {
	getEmployees().then(function (employeesList) {
			console.log(employeesList);
	});
	res.send('respond with a resource');
});

router.get('/new-users', function (req, res, next) {

	res.send('respond with a resource');
});


router.get('/top-salaries', function (req, res, next) {

	res.send('respond with a resource');
});

router.get('/badge', function (req, res, next) {

	res.send('respond with a resource');
});


module.exports = router;
