const mockYaDysk = require('../mocks/yandexDyskService');
const reportService = require('../../src/services/reportService');

jest.mock('../../src/services/yandexDyskService', () => {
	return function () {
		return mockYaDysk();
	};
});

describe('Test for new users report', () => {
	const newUserReportSettings = [
		{
			"report_name": "new_users",
			"parameters": [
				{
					"id": "num_of_records",
					"value": 10
				}
			]
		}
	];

	test('when user get new user report record structure is correct', async () => {
		const report = await reportService.newUsersReport(newUserReportSettings, 1, 10);

		expect(report).toBeDefined();
		for (let i = 0; i < report.users.length; i++) {
			const employee = report.users[i];
			expect(employee).toHaveProperty('firstName');
			expect(employee).toHaveProperty('lastName');
			expect(employee).toHaveProperty('joinDate');
		}

	});

	test('when user get new user report it is correct', async () => {
		const firstPage = await reportService.newUsersReport(newUserReportSettings, 1, 5);
		const secondPage = await reportService.newUsersReport(newUserReportSettings, 2, 5);

		expect(firstPage).toBeDefined();
		expect(secondPage).toBeDefined();
		let employeesOnFirstPage = firstPage.users;
		let employeesOnSecondPage = secondPage.users;

		expect(firstPage.totalNumber).toBe(9);
		expect(secondPage.totalNumber).toBe(9);
		expect(employeesOnFirstPage).toHaveLength(5);
		expect(employeesOnSecondPage).toHaveLength(4);

		expect(employeesOnFirstPage).toEqual(
			expect.not.arrayContaining(employeesOnSecondPage)
		)
	});

	test('when user get new user report records are in correct sequence', async () => {
		const report = await reportService.newUsersReport(newUserReportSettings, 1, 10);
		expect(report).toBeDefined();

		for (let i = 1; i < report.users.length; i++) {
			const employee = report.users[i];
			const prevEmployee = report.users[i - 1];
			expect(Date.parse(employee.joinDate) <= Date.parse(prevEmployee.joinDate)).toBeTruthy();
		}

	});
});


describe('Test for badge report', () => {
	const settingsBadge = [
		{
			"report_name": "badge",
			"parameters": [
				{
					"id": "num_of_records",
					"value": 10
				}
			]
		}
	];

	test('when user get badge report record structure is correct', async () => {
		const report = await reportService.userWithBadgeReport(settingsBadge, 1, 10, "4 Years Badge");

		expect(report).toBeDefined();
		for (let i = 0; i < report.users.length; i++) {
			const employee = report.users[i];
			expect(employee).toHaveProperty('name');
			expect(employee).toHaveProperty('lastName');
			expect(employee).toHaveProperty('badges');

			for (let j = 0; j < employee.badges.length; j++) {
				const badge = employee.badges[j];
				expect(badge).toHaveProperty('id');
				expect(badge).toHaveProperty('date');
			}
		}
	});

	test('when user get badge report result data is correct', async () => {
		const haveResult = await reportService.userWithBadgeReport(settingsBadge, 1, 10, "4 Years Badge");

		expect(haveResult).toBeDefined();

		expect(haveResult.totalNumber).toBe(3);
		expect(haveResult.users).toHaveLength(3);

		for (let i = 0; i < haveResult.users; i++) {
			const employee = haveResult.users[i];

			expect(employee.badges).toEqual(
				expect.arrayContaining({
					'id': '4 Years Badge',
					'date': '2018-12-18'
				})
			)
		}
	});

	test('when there is no user with badge empty data', async () => {
		const noResult = await reportService.userWithBadgeReport(settingsBadge, 1, 10, "40 Years Badge");

		expect(noResult).toBeDefined();

		expect(noResult.totalNumber).toBe(0);
		expect(noResult.users).toHaveLength(0);
	});
});

