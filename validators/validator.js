const Ajv = require('ajv');
const requestSchema = require('./schemas/updateSettingsReq').schema;

const ajv = Ajv();
ajv.addSchema(requestSchema, 'update-settings');

function errorResponse(schemaErrors) {
	return {
		status: 'error',
		error: {
			path: schemaErrors[0].dataPath,
			message: schemaErrors[0].message
		}
	};
}

function validateSchema (schemaName) {
	return (req, res, next) => {
		let isValid = ajv.validate(schemaName, req.body);
		if (!isValid) {
			res.status(400).json(errorResponse(ajv.errors));
		} else {
			next();
		}
	}
}

module.exports = validateSchema;
