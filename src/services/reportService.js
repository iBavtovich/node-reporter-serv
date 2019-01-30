const getEmployeesListFromDysk = require('./yandexDyskService');

const recentEmployeeComparator = (a, b) => Date.parse(b.joinDate) - Date.parse(a.joinDate);
const topSalaryComparator = (a, b) => b.salary - a.salary;
const recentUserReportMapping = user => {
	return {
		firstName: user.name,
		lastName: user.lastName,
		joinDate: user.joinDate
	};
};
const topSalariesReportMappingForExchangeRate = exchangeRate => {
	return user => {
		return {
			firstName: user.name,
			lastName: user.lastName,
			salary: user.salary,
			salaryUsd: Math.round(user.salary / exchangeRate)
		};
	};
};

async function getRecentEmployeesList(settings, page, pageSize) {
	const maxNumberInReport = settings[0].parameters.filter(e => e.id === 'num_of_records')[0];

	return getListOfEmployeesSortedByFuncWithPagination(maxNumberInReport.value, page, pageSize, recentEmployeeComparator, recentUserReportMapping);
}

async function getTopSalariesEmployeesList(settings) {
	const exchangeRate = settings[0].parameters.filter(e => e.id === 'exchange_rate')[0];

	const mappingFunction = topSalariesReportMappingForExchangeRate(exchangeRate.value);
	return getListOfEmployeesSortedByFuncWithPagination(10, 1, 10, topSalaryComparator, mappingFunction);
}

async function getListOfEmployeesSortedByFuncWithPagination(maxNumberInReport, page, pageSize, sortFunction, mappingFunction) {
	const employees = await getEmployeesListFromDysk();
	employees.sort(sortFunction);

	const employeesForReport = employees.slice(0, maxNumberInReport);
	const employeesForPage = getEmployeesWithPagination(employeesForReport, page, pageSize);

	const pageResult = [];
	for (let i = 0; i < employeesForPage.length; i++) {
		pageResult.push(mappingFunction(employeesForPage[i]));
	}

	return {
		totalNumber: employeesForReport.length,
		users: pageResult
	};
}

async function getListOfEmployeesWithBadge(settings, page, pageSize, badgeName) {
	const maxNumberInReport = settings[0].parameters.filter(e => e.id === 'num_of_records')[0];
	const employees = await getEmployeesListFromDysk();
	let employeesForReport = [];
	for (let i = 0; i < employees.length; i++) {
		const employee = employees[i];
		for (let j = 0; j < employee.badges.length; j++) {
			const badge = employee.badges[j];
			if (badge.id === badgeName) {
				employeesForReport.push(employee);
			}
		}
	}
	employeesForReport = employeesForReport.slice(0, maxNumberInReport.value);
	const employeesForPage = getEmployeesWithPagination(employeesForReport, page, pageSize);

	const pageResult = [];
	for (let i = 0; i < employeesForPage.length; i++) {
		const empl = employeesForPage[i];
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
	const fromIndex = (page - 1) * pageSize;
	const toIndex = page * pageSize;

	return listOfEmployees.slice(fromIndex, toIndex);
}

module.exports.newUsersReport = getRecentEmployeesList;
module.exports.topSalariesReport = getTopSalariesEmployeesList;
module.exports.userWithBadgeReport = getListOfEmployeesWithBadge;
