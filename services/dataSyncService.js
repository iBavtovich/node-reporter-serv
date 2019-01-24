const axios = require('axios');
const token = require('../configs/config').yandexToken;
const settingsConverter = require('../converters/settingsConverter');

const yandexHttpClient = axios.create({
	baseURL: 'https://cloud-api.yandex.net/v1/data/app/databases',
	timeout: 5000,
	headers: {Authorization: 'OAuth ' + token},
	validateStatus: status => {
		return status >= 200 && status < 500;
	}
});

const getSettingsForUser = async userId => {
	await createSettingsWhenNotExists(userId);
	const settingsFromYandex = await (receiveSettingsForReport(userId));

	return {settings: settingsConverter.convertSettingsFromYandex(settingsFromYandex)};
};

const updateSettings = async (userId, settingsUpdate) => {
	const dbRevision = await getDBRevision(userId);
	const updateQueryObject = settingsConverter.convertSettingsToChangeSet(settingsUpdate);

	return updateSettingsInDB(userId, updateQueryObject, dbRevision);
};

async function getDBRevision(userId) {
	try {
		const response = await yandexHttpClient.get('/' + userId);
		return response.data.revision;
	} catch (error) {
		console.error(error);
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
		const settingsUpdate = {
			delta_id: 'Add settings to collection',
			changes: [
				{
					change_type: 'insert',
					collection_id: 'settings',
					record_id: 'new_users',
					changes: [{
						change_type: 'set',
						field_id: 'num_of_records',
						value: {
							type: 'integer',
							integer: 10
						}
					}]
				}, {
					change_type: 'insert',
					collection_id: 'settings',
					record_id: 'badge',
					changes: [{
						change_type: 'set',
						field_id: 'num_of_records',
						value: {
							type: 'integer',
							integer: 10
						}
					}]
				}
			]
		};

		const response = await yandexHttpClient.post(`/${userId}/deltas/`, settingsUpdate, {
			headers: {'If-Match': 0}
		});
		console.log('Settings was created in DB with status: ' + response.status);
	} catch (error) {
		console.error(error);
	}
}

async function updateSettingsInDB(userId, updateQueryObject, dbRevision) {
	try {
		const response = await yandexHttpClient.post(`/${userId}/deltas/`, updateQueryObject, {
			headers: {'If-Match': dbRevision}
		});
		console.log('Settings was updated in DB with status: ' + response.status);
		return response.status;
	} catch (error) {
		console.error(error);
	}
}

async function receiveSettingsForReport(userId) {
	try {
		const result = await yandexHttpClient.get(`/${userId}/snapshot?collection_id=settings`);
		return result.data.records;
	} catch (error) {
		console.error(error);
	}
}

async function getSettingsForReport(userId, reportType) {
	const settings = await getSettingsForUser(userId);
	return settings.settings.filter(e => e.report_name === reportType);
}

module.exports.getSettingsForUser = getSettingsForUser;
module.exports.updateSettings = updateSettings;
module.exports.getSettingsForReport = getSettingsForReport;
