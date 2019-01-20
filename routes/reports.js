var express = require('express');
var parse = require('csv-parse');
var halson = require('halson');
var getEmployees = require('../services/yandexDyskService');
var reportService = require('../services/reportService');
var router = express.Router();

router.get('/', function (req, res, next) {
	getEmployees().then(function (employeesList) {
		console.log(employeesList);
	});
	res.send('respond with a resource');
});

router.get('/new-users', async function (req, res, next) {
	let page = req.query.page;
	let pageSize = req.query.pageSize;
	if (page === undefined) {
		page = 1;
	}
	if (pageSize === undefined) {
		pageSize = 5;
	}
	if (page <= 0 || pageSize <= 0) {
		res.status(400).json({error: 'Parameters page and pageSize can\'t be less than 1'});
	}
	let usersData = await reportService.newUsersReport(99, page, pageSize);

	let response = halson({
		page: page,
		pageSize: pageSize,
		totalRecords: usersData.totalNumber,
		employees: usersData.users
	})
	.addLink('self', 'http://' + req.headers.host + req.originalUrl);

	res.status(200).json(response);
});


router.get('/top-salaries', async function (req, res, next) {

	let usersData = await reportService.topSalariesReport();

	let response = halson({
		employees: usersData.users
	})
	.addLink('self', 'http://' + req.headers.host + req.originalUrl);

	res.status(200).json(response);
});

router.get('/badge', function (req, res, next) {

	res.send('respond with a resource');
});


module.exports = router;
