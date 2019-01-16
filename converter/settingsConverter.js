function convertSettingsFromYandex(yaSettings) {
	let settings = [];
	for (let i = 0; i < yaSettings.items.length; i++) {
		let reportSettings = yaSettings.items[i];
		let params = [];
		for (let j = 0; j < reportSettings.fields.length; j++) {
			let setting = reportSettings.fields[j];
			params.push({'id': setting.field_id, 'value': setting.value.integer})
		}
		settings.push({'report_name': reportSettings.record_id, 'parameters': params});
	}
	return settings;
}

function convertSettingsToChangeSet(settingsUpdate) {
	let settingsUpdateQuery = {
		"delta_id": "Update settings to collection",
		"changes": []
	};

	let changes = [];
	for (let i = 0; i < settingsUpdate.length; i++) {
		let settingsUpdateElement = settingsUpdate[i];
		let paramChanges = [];
		let reportSettings = {
			"change_type": "update",
			"collection_id": "settings",
			"record_id": settingsUpdateElement.report_name,
			"changes": []
		};

		for (let j = 0; j < settingsUpdateElement.parameters.length; j++) {
			let parameter = settingsUpdateElement.parameters[j];
			let changeSet = {
				"change_type": "set",
				"field_id": parameter.id,
				"value": {
					"type": "integer",
					"integer": parameter.value
				}
			};
			paramChanges.push(changeSet);
		}
		reportSettings.record_id = settingsUpdateElement.report_name;
		reportSettings.changes = paramChanges;

		changes.push(reportSettings);
	}
	settingsUpdateQuery.changes = changes;
	return settingsUpdateQuery;
}

module.exports.convertSettingsFromYandex = convertSettingsFromYandex;
module.exports.convertSettingsToChangeSet = convertSettingsToChangeSet;