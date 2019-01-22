const getEmployeesListFromDysk = require('./yandexDyskService');
const recentEmployeeComparator = (a, b) => Date.parse(b.joinDate) - Date.parse(a.joinDate);
const topSalaryComparator = (a, b) =>  b.salary - a.salary;
const recentUserReportMapping = (user) => {
	return {
		firstName: user.name,
		lastName: user.lastName,
		joinDate: user.joinDate
	};
};
const topSalariesReportMapping = (user) => {
	return {
		firstName: user.name,
		lastName: user.lastName,
		salary: user.salary,
		salaryUsd: Math.round(user.salary / 67)
	};
};

async function getRecentEmployeesList(settings, page, pageSize) {
	let maxNumberInReport = settings[0].parameters.filter(e => e.id === 'num_of_records');

	return getListOfEmployeesSortedByFuncWithPagination(maxNumberInReport.value, page, pageSize, recentEmployeeComparator, recentUserReportMapping);
}

async function getTopSalariesEmployeesList() {
	return getListOfEmployeesSortedByFuncWithPagination(10, 1, 10, topSalaryComparator, topSalariesReportMapping);
}

async function getListOfEmployeesSortedByFuncWithPagination(maxNumberInReport, page, pageSize, sortFunction, mappingFunction) {

	let employees = await getEmployeesListFromDysk();
	employees.sort(sortFunction);

	let employeesForReport = employees.slice(0, maxNumberInReport);
	let employeesForPage = getEmployeesWithPagination(employeesForReport, page, pageSize);

	let pageResult = [];
	for (let i = 0; i < employeesForPage.length; i++) {
		pageResult.push(mappingFunction(employeesForPage[i]));
	}

	return {
		totalNumber: employeesForReport.length,
		users: pageResult
	};
}

async function getListOfEmployeesWithBadge(settings, page, pageSize, badgeName) {
	let maxNumberInReport = settings[0].parameters.filter(e => e.id === 'num_of_records');
	let employees = await getEmployeesListFromDysk();
	let employeesForReport = [];
	for (let i = 0; i < employees.length; i++) {
		let employee = employees[i];
		for (let j = 0; j < employee.badges.length; j++) {
			let badge = employee.badges[j];
			if (badge.id === badgeName) {
				employeesForReport.push(employee);
			}
		}
	}

	let employeesForPage = getEmployeesWithPagination(employeesForReport.slice(0, maxNumberInReport.value), page, pageSize);

	let pageResult = [];
	for (let i = 0; i < employeesForPage.length; i++) {
		let empl = employeesForPage[i];
		pageResult.push({
			name: empl.name,
			lastName: empl.lastName,
			badges: empl.badges
		});
	}

	return {
		totalNumber: employeesForReport.length,
		users: pageResult
	};
}

function getEmployeesWithPagination(listOfEmployees, page, pageSize) {
	let fromIndex = (page - 1) * pageSize;
	let toIndex = page * pageSize;

	return listOfEmployees.slice(fromIndex, toIndex);
}

module.exports.newUsersReport = getRecentEmployeesList;
module.exports.topSalariesReport = getTopSalariesEmployeesList;
module.exports.userWithBadgeReport = getListOfEmployeesWithBadge;