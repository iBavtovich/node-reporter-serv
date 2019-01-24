const express = require('express');
const createError = require('http-errors');
const logger = require('morgan');
const bb = require('express-busboy');
const cors = require('cors');
const passportConfig = require('./configs/passport');
const photosRouter = require('./routes/photos');
const reportsRouter = require('./routes/reports');
const settingsRouter = require('./routes/settings');
const authRouter = require('./routes/authentication');
const {port, host} = require('./configs/config');

const app = express();
const expressSwagger = require('express-swagger-generator')(app);

const options = {
	swaggerDefinition: {
		info: {
			description: 'Reporter server',
			title: 'Swagger API of Reporter Service',
			version: '1.0.0',
		},
		host: `${host}:${port}`,
		basePath: '/',
		produces: [
			'application/json',
		],
		schemes: ['http'],
		securityDefinitions: {
			bearerAuth: {
				type: 'apiKey',
				in: 'header',
				name: 'Authorization',
				description: 'Get using /authenticate end-point',
			}
		}
	},
	basedir: '../reporter',
	files: ['./routes/*.js']
};
expressSwagger(options);

app.use(cors());
app.use(logger('dev'));

app.use(express.urlencoded({extended: false}));
app.use(express.json());
bb.extend(app, {
	upload: true,
	allowedPath: /^\/photos\/\d$/,
	mimeTypeLimit: [
		'image/jpeg',
		'image/png'
	]
});

app.use('/authenticate', authRouter);
app.use('/reports', reportsRouter);
app.use('/settings', settingsRouter);
app.use('/photos', photosRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});

// Error handler
app.use((err, req, res) => {
	// Set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// Render the error page
	res.status(err.status || 500);
});

module.exports = app;
