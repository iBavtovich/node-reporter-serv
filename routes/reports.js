const express = require('express');
let passport = require('passport');
const halson = require('halson');
const reportService = require('../services/reportService');
const dataSyncService = require('../services/dataSyncService');
const router = express.Router();

router.get('/new-users', passport.authenticate('bearer', { session: false }), async function (req, res, next) {
	let page = req.query.page;
	let pageSize = req.query.pageSize;
	checkParams(page, pageSize, res);
	let settings = await dataSyncService.getSettingsForReport(req.user.id, 'new_users');
	let usersData = await reportService.newUsersReport(settings, page, pageSize);

	let response = halson({
		page: page,
		pageSize: pageSize,
		totalRecords: usersData.totalNumber,
		employees: usersData.users
	})
	.addLink('self', 'http://' + req.headers.host + req.originalUrl);

	res.status(200).json(response);
});


router.get('/top-salaries', passport.authenticate('bearer', { session: false }), async function (req, res, next) {

	let usersData = await reportService.topSalariesReport();

	let response = halson({
		employees: usersData.users
	})
	.addLink('self', 'http://' + req.headers.host + req.originalUrl);

	res.status(200).json(response);
});

router.get('/badge', passport.authenticate('bearer', { session: false }), async function (req, res, next) {
	let page = req.query.page;
	let pageSize = req.query.pageSize;
	let badgeName = req.query.badge;
	checkParams(page, pageSize, res);
	if (badgeName === undefined) {
		res.status(400).json({error: 'Badge parameter should be provided'});
	}

	let settings = await dataSyncService.getSettingsForReport(req.user.id, 'badge');
	let usersData = await reportService.userWithBadgeReport(settings, page, pageSize, badgeName);

	let response = halson({
		page: page,
		pageSize: pageSize,
		totalRecords: usersData.totalNumber,
		employees: usersData.users
	})
	.addLink('self', 'http://' + req.headers.host + req.originalUrl);

	res.status(200).json(response);
});

function checkParams(page, pageSize, res) {
	if (page === undefined) {
		page = 1;
	}
	if (pageSize === undefined) {
		pageSize = 5;
	}
	if (page <= 0 || pageSize <= 0) {
		res.status(400).json({error: 'Parameters page and pageSize can\'t be less than 1'});
	}
}

module.exports = router;
