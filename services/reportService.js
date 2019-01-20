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
	return getListOfEmployeesSortedByFuncWithPagination(settings, page, pageSize, recentEmployeeComparator, recentUserReportMapping);
}

async function getTopSalariesEmployeesList() {
	return getListOfEmployeesSortedByFuncWithPagination(10, 1, 10, topSalaryComparator, topSalariesReportMapping);
}

async function getListOfEmployeesSortedByFuncWithPagination(settings, page, pageSize, sortFunction, mappingFunction) {

	let employees = await getEmployeesListFromDysk();
	employees.sort(sortFunction);

	let employeesForReport = employees.slice(0, settings);
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

function getEmployeesWithPagination(listOfEmployees, page, pageSize) {
	let fromIndex = (page - 1) * pageSize;
	let toIndex = page * pageSize;

	return listOfEmployees.slice(fromIndex, toIndex);
}

module.exports.newUsersReport = getRecentEmployeesList;
module.exports.topSalariesReport = getTopSalariesEmployeesList;