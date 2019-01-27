const express = require('express');
const passport = require('passport');
const halson = require('halson');
const reportService = require('../services/reportService');
const dataSyncService = require('../services/dataSyncService');

const router = express.Router();

/**
 * @typedef Href
 * @property {string} href
 */

/**
 * @typedef SelfLink
 * @property {Href.model} self
 */

/**
 * @typedef RecentEmployee
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} joinDate
 */

/**
 * @typedef NewUsersReport
 * @property {string} page - Number of page
 * @property {string} pageSize - Page size
 * @property {string} totalRecords - Total records in report
 * @property {Array.<RecentEmployee>} employees - List of employees
 * @property {SelfLink.model} _links - Link
 */

/**
 * @route GET /reports/new-users
 * @group Report Service - Report about employees
 * @param {string} page.query
 * @param {string} pageSize.query
 * @produces application/json
 * @returns {NewUsersReport.model} 200 - Result
 * @returns {Error} 400 - Invalid parameters
 * @returns {Error} 401 - Invalid token
 * @returns {Error} default - Unexpected error
 * @security bearerAuth
 */
router.get('/new-users', passport.authenticate('bearer', {session: false}), async (req, res) => {
	let {page, pageSize} = req.query;
	if (page === undefined) {
		page = 1;
	}
	if (pageSize === undefined) {
		pageSize = 5;
	}
	if (page <= 0 || pageSize <= 0) {
		res.status(400).json({error: 'Parameters page and pageSize can\'t be less than 1'});
	}
	const settings = await dataSyncService.getSettingsForReport(req.user.id, 'new_users');
	const usersData = await reportService.newUsersReport(settings, page, pageSize);

	const response = halson({
		page,
		pageSize,
		totalRecords: usersData.totalNumber,
		employees: usersData.users
	})
		.addLink('self', 'http://' + req.headers.host + req.originalUrl);

	res.status(200).json(response);
});

/**
 * @typedef SalaryEmployee
 * @property {string} firstName
 * @property {string} lastName
 * @property {integer} salary - Salary in RUB
 * @property {integer} salaryUsd - Salary in US dollars
 */

/**
 * @typedef TopSalaryReport
 * @property {Array.<SalaryEmployee>} employees - List of employees
 * @property {SelfLink.model} _links - link
 */

/**
 * @route GET /reports/top-salaries
 * @group Report Service - Report about employees
 * @produces application/json
 * @returns {TopSalaryReport.model} 200 - Result
 * @returns {Error} 401 - Invalid token
 * @returns {Error} default - Unexpected error
 * @security bearerAuth
 */
router.get('/top-salaries', passport.authenticate('bearer', {session: false}), async (req, res) => {
	const usersData = await reportService.topSalariesReport();

	const response = halson({
		employees: usersData.users
	})
		.addLink('self', 'http://' + req.headers.host + req.originalUrl);

	res.status(200).json(response);
});

/**
 * @typedef Badge
 * @property {string} id
 * @property {string} date
 */

/**
 * @typedef BadgeEmployee
 * @property {string} name
 * @property {string} lastName
 * @property {Array.<Badge>} badges
 */

/**
 * @typedef UsersBadgeReport
 * @property {string} page - Number of page
 * @property {string} pageSize - Page size
 * @property {string} totalRecords - Total records in report
 * @property {Array.<BadgeEmployee>} employees - List of employees
 * @property {SelfLink.model} _links - Link
 */

/**
 * @route GET /reports/badge
 * @group Report Service - Report about employees
 * @param {string} page.query
 * @param {string} pageSize.query
 * @param {string} badge.query.required - Badge Name
 * @produces application/json
 * @returns {UsersBadgeReport.model} 200 - Result
 * @returns {Error} 400 - Invalid parameters
 * @returns {Error} 401 - Invalid token
 * @returns {Error} default - Unexpected error
 * @security bearerAuth
 */
router.get('/badge', passport.authenticate('bearer', {session: false}), async (req, res) => {
	let {page, pageSize} = req.query;
	const badgeName = req.query.badge;
	if (page === undefined) {
		page = 1;
	}
	if (pageSize === undefined) {
		pageSize = 5;
	}
	if (page <= 0 || pageSize <= 0) {
		res.status(400).json({error: 'Parameters page and pageSize can\'t be less than 1'});
	}
	if (badgeName === undefined) {
		res.status(400).json({error: 'Badge parameter should be provided'});
	}

	const settings = await dataSyncService.getSettingsForReport(req.user.id, 'badge');
	const usersData = await reportService.userWithBadgeReport(settings, page, pageSize, badgeName);

	const response = halson({
		page,
		pageSize,
		totalRecords: usersData.totalNumber,
		employees: usersData.users
	})
		.addLink('self', 'http://' + req.headers.host + req.originalUrl);

	res.status(200).json(response);
});

module.exports = router;
