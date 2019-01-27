const converter = require('../../src/converters/settingsConverter');
const yandexSettingsReponse = require('../mocks/reponse/dataSyncResponces');

test('When convert data from YandexData Sync result is correct', () => {
	const data = converter.convertSettingsFromYandex(yandexSettingsReponse.records);
	const expectData = [{
		report_name: 'badge',
		parameters: [
			{
				id: 'num_of_records',
				value: 10
			}]
	}, {
		report_name: 'new_users',
		parameters: [
			{
				id: 'num_of_records',
				value: 10
			}]
	}];
	expect(data).toEqual(expectData);
});

test('When convert settings from user to change set result is correct', () => {
	const changedParameter = [{
		report_name: 'badge',
		parameters: [
			{
				id: 'num_of_records',
				value: 99
			}]
	}];
	const data = converter.convertSettingsToChangeSet(changedParameter);
	expect(data.delta_id).toBe('Update settings to collection');
	expect(data.changes.length).toBe(1);
	const change = data.changes[0];
	expect(change.change_type).toBe('update');
	expect(change.record_id).toBe(changedParameter[0].report_name);
	expect(change.changes[0].field_id).toBe(changedParameter[0].parameters[0].id);
	expect(change.changes[0].value.type).toBe('integer');
	expect(change.changes[0].value.integer).toBe(changedParameter[0].parameters[0].value);
});