const schema = {
	"title": "settings update",
	"description": "Schema of update settings request",
	"type": "object",
	"properties": {
		"settings": {
			"type": "array",
			"items": {
				"type": "object",
				"properties": {
					"report_name": {
						"type": "string"
					},
					"parameters": {
						"type": "array",
						"items": {
							"type": "object",
							"properties": {
								"id": {
									"type": "string"
								},
								"value": {
									"type": "number"
								}
							}
						}
					}
				}
			}
		}
	},
	"required": ["settings"],
	"additionalProperties": false
};

module.exports.schema = schema;