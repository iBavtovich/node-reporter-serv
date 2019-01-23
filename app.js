var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
const bb = require('express-busboy');
const photosRouter = require('./routes/photos');
var cors = require('cors');

require('./configs/passport');
const reportsRouter = require('./routes/reports');
const settingsRouter = require('./routes/settings');
const authRouter = require('./routes/authentication');

const app = express();
const expressSwagger = require('express-swagger-generator')(app);

let options = {
  swaggerDefinition: {
    info: {
      description: 'Reporter server',
      title: 'Swagger',
      version: '1.0.0',
    },
    host: 'localhost:3000',
    basePath: '/',
    produces: [
      "application/json",
    ],
    schemes: ['http'],
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: "Get using /authenticate end-point",
      }
    }
  },
  basedir: '../reporter',
  files: ['./routes/*.js']
};
expressSwagger(options);


app.use(cors());
app.use(logger('dev'));

app.use(express.urlencoded({ extended: false }));
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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
