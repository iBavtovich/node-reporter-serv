const axios = require('axios');
const token = require('./yandexAuth');
const settingsConverter = require('../converter/settingsConverter');

const yandexHttpClient = axios.create({
	baseURL: 'https://cloud-api.yandex.net/v1/data/app/databases',
	timeout: 5000,
	headers: {'Authorization': 'OAuth ' + token}
});

var getSettingsForUser = async function getSettingsForUser(userId) {
	await createSettingsWhenNotExists(userId);
	let settingsFromYandex = await (receiveSettingsForReport(userId));

	return {'settings' : settingsConverter.convertSettingsFromYandex(settingsFromYandex)};
};

var updateSettings = async function updateSettings(userId, settingsUpdate) {
	let dbRevision = await getDBRevision(userId);
	let updateQueryObject = settingsConverter.convertSettingsToChangeSet(settingsUpdate);

	return await updateSettingsInDB(userId, updateQueryObject, dbRevision);
};

async function getDBRevision(userId) {
	try {
		const response = await yandexHttpClient.get('/' + userId);
		return response.data.revision;
	} catch (e) {
		console.error(e);
	}
}

async function createSettingsWhenNotExists(userId) {
	try {
		const response = await yandexHttpClient.put('/' + userId);

		if (response.status === 201) {
			await setUpSettingsFirstTime(userId);
		}
		console.log(response.status);
	} catch (error) {
		console.error(error);
	}
}

async function setUpSettingsFirstTime(userId) {
	try {
		let settingsUpdate = {
			"delta_id": "Add settings to collection",
			"changes": [
				{
					"change_type": "insert",
					"collection_id": "settings",
					"record_id": "new_users",
					"changes": [{
						"change_type": "set",
						"field_id": "num_of_records",
						"value": {
							"type": "integer",
							"integer": 10
						}
					}]
				}, {
					"change_type": "insert",
					"collection_id": "settings",
					"record_id": "top_salaries",
					"changes": [{
						"change_type": "set",
						"field_id": "num_of_records",
						"value": {
							"type": "integer",
							"integer": 10
						}
					}]
				}
			]
		};

		await yandexHttpClient.post('/' + userId + '/deltas/', settingsUpdate, {
			headers: {'If-Match': 0}
		});
		console.log("Settings was created in DB with status: " + response.status);
	} catch (error) {
		console.error(error);
	}
}

async function updateSettingsInDB(userId, updateQueryObject, dbRevision) {
	try {
		var response = await yandexHttpClient.post('/' + userId + '/deltas/', updateQueryObject, {
			headers: {'If-Match': dbRevision}
		});
		console.log("Settings was updated in DB with status: " + response.status);
		return response.status;
	} catch (error) {
		console.error(error);
	}
}

async function receiveSettingsForReport(userId) {
	try {
		let result = await yandexHttpClient.get('/' + userId + "/snapshot?collection_id=settings");
		return result.data.records;
	} catch (e) {
		console.log(e);
	}
}

module.exports.getSettingsForUser = getSettingsForUser;
module.exports.updateSettings = updateSettings;