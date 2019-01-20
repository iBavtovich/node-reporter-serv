const getEmployeesListFromDysk = require('./yandexDyskService');

async function getRecentEmployeesList(settings, page, pageSize) {

	let employees = await getEmployeesListFromDysk();
	employees.sort(function(a,b){
		var c = new Date(a.joinDate);
		var d = new Date(b.joinDate);
		return d-c;
	});

	let employeesForReport = employees.slice(0, settings);
	let employeesForPage = getEmployeesWithPagination(employeesForReport, page, pageSize);

	let pageResult = [];
	for (let i = 0; i < employeesForPage.length; i++) {
		let empl = employeesForPage[i];
		pageResult.push({
			firstName: empl.name,
			lastName: empl.lastName,
			joinDate: empl.joinDate
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