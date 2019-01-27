const axios = require('axios');
const parse = require('csv-parse/lib/sync');
const token = require('../configs/config').yandexToken;
const Employee = require('../models/employee');

const fileName = 'employees.csv';

const yandexHttpClient = axios.create({
	timeout: 5000,
	headers: {Authorization: 'OAuth ' + token},
	validateStatus(status) {
		return status >= 200 && status < 500;
	}
});

const getEmployeesListFromDysk = async () => {
	const employees = [];
	const fileLink = await getLinkForFileDownloading(fileName);
	const csvContent = await downloadFileForLink(fileLink);
	const data = parse(csvContent);
	for (let i = 1; i < data.length; i++) {
		const employee = new Employee(data[i]);
		employees.push(employee);
	}
	return employees;
};

async function getLinkForFileDownloading(file) {
	try {
		const response = await yandexHttpClient.get('https://cloud-api.yandex.net/v1/disk/resources/download?path=' + file);
		return response.data.href;
	} catch (error) {
		console.error(error);
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
