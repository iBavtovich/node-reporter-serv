const dotenv = require('dotenv');

dotenv.config();

module.exports = {
	host: process.env.HOST,
	port: process.env.PORT,
	yandexToken: process.env.YANDEX_TOKEN
};
