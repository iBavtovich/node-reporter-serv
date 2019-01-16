const Ajv = require('ajv');
const ajv = Ajv();
const requestSchema = require('./schemas/updateSettingsReq').schema;
ajv.addSchema(requestSchema, 'update-settings');

function errorResponse(schemaErrors) {
	return {
		status: 'error',
		error: {
			path: ajv.errors[0].dataPath,
			message: ajv.errors[0].message
		}
	};
}

function validateSchema (schemaName) {
	return (req, res, next) => {
		let isValid = ajv.validate(schemaName, req.body);
		if(!isValid) {
			res.status(400).json(errorResponse(ajv.errors));
		} else {
			next()
		}
	}
}

module.exports = validateSchema;