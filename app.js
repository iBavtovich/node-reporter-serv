var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var bb = require('express-busboy');

var photosRouter = require('./routes/photos');
var reportsRouter = require('./routes/reports');
var settingsRouter = require('./routes/settings');

var app = express();

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
