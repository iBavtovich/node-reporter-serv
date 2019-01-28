const dotenv = require('dotenv');

dotenv.config();

module.exports = {
	host: process.env.HOST,
	port: process.env.PORT,
	yandexToken: process.env.YANDEX_TOKEN,
	maxNumOfRecords: process.env.REPORT_NUM_OF_RECORDS,
	exchangeRate: process.env.REPORT_EXCH_RATE
};
