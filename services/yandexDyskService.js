const axios = require('axios');
const token = require('./yandexAuthService');
const parse = require('csv-parse/lib/sync');
const Employee = require('../models/employee');
const settingsConverter = require('../converters/settingsConverter');
const fileName = 'employees.csv';

const yandexHttpClient = axios.create({
	timeout: 5000,
	headers: {'Authorization': 'OAuth ' + token},
	validateStatus: function (status) {
		return status >= 200 && status < 500;
	}
});

var getEmployeesListFromDysk = async function downloadEmployeesListFromDysk() {
	let employees = [];
	let fileLink = await getLinkForFileDownloading(fileName);
	let csvContent = await downloadFileForLink(fileLink);
	let data =  parse(csvContent);
	for (let i = 1; i < data.length; i++) {
		let employee = new Employee(data[i]);
		employees.push(employee);
	}
	return employees;
};

async function getLinkForFileDownloading(file) {
	try {
		const response = await yandexHttpClient.get('https://cloud-api.yandex.net/v1/disk/resources/download?path=' + file);
		return response.data.href;
	} catch (e) {
		console.error(e);
	}
}

async function downloadFileForLink(fileLink) {
	try {
		const response = await yandexHttpClient.get(fileLink);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

module.exports = getEmployeesListFromDysk;