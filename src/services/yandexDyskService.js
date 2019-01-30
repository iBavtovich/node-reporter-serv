const axios = require('axios');
const parse = require('csv-parse/lib/sync');
const parseUri = require('parseUri');
const token = require('../configs/config').yandexToken;
const Employee = require('../models/employee');

const fileName = 'employees.csv';
const yandexDyskData = {
	eTag: undefined,
	employees: []
};

const yandexHttpClient = axios.create({
	timeout: 5000,
	headers: {Authorization: 'OAuth ' + token},
	validateStatus(status) {
		return status >= 200 && status < 500;
	}
});

const getEmployeesListFromDysk = async () => {
	const fileLink = await getLinkForFileDownloading(fileName);

	if (fileNotModified(fileLink)) {
		return yandexDyskData.employees;
	}

	const employees = [];
	const csvContent = await downloadFileForLink(fileLink);
	const data = parse(csvContent);
	for (let i = 1; i < data.length; i++) {
		const employee = new Employee(data[i]);
		employees.push(employee);
	}

	yandexDyskData.employees = employees;

	return employees;
};

async function getLinkForFileDownloading(file) {
	try {
		const response = await yandexHttpClient.get('https://cloud-api.yandex.net/v1/disk/resources/download?path=' + file);
		console.log(`Link for downloading file ${response.data.href}`);
		return response.data.href;
	} catch (error) {
		console.error(error);
	}
}

async function downloadFileForLink(fileLink) {
	try {
		const response = await yandexHttpClient.get(fileLink);
		console.log('File from YandexDysk was downloaded');
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

function fileNotModified(fileLink) {
	const parsedLink = parseUri(fileLink);
	const eTag = parsedLink.queryKey.etag;
	if (eTag === yandexDyskData.eTag) {
		return true;
	}

	yandexDyskData.eTag = eTag;
	return false;
}

module.exports = getEmployeesListFromDysk;
