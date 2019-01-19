const schema = {
	"title": "credentials",
	"description": "Schema for authentication",
	"type": "object",
	"properties": {
		"username": {
			"type": "string"
		},
		"password": {
			"type": "string"
		}
	},
	"required": ["username", "password"],
	"additionalProperties": false
};

module.exports.schema = schema;