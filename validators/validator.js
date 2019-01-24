const ajV = require('ajv');
const requestSchema = require('./schemas/updateSettingsReq').schema;
const authSchema = require('./schemas/userLoginSchema').schema;

const ajv = ajV();
ajv.addSchema(requestSchema, 'update-settings');
ajv.addSchema(authSchema, 'auth-user');

function errorResponse(schemaErrors) {
	return {
		status: 'error',
		error: {
			path: schemaErrors[0].dataPath,
			message: schemaErrors[0].message
		}
	};
}

function validateSchema(schemaName) {
	return (req, res, next) => {
		const isValid = ajv.validate(schemaName, req.body);
		if (isValid) {
			next();
		} else {
			res.status(400).json(errorResponse(ajv.errors));
		}
	};
}

module.exports = validateSchema;
