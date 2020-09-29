var express = require('express');
var path = require('path');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var https = require('https');
const fileUpload = require('express-fileupload');
var app = express();
var cors = require('cors');
var config = require('./constant/config');
var fs = require('fs');
var routes = require('./routes/api.routes');

app.use(fileUpload());

app.use(cors());

var mongoose = require('mongoose');
var options = {
  key: fs.readFileSync('/opt/meet.idesk.lk/keys/ssl-cert-idesk.key'),
  cert: fs.readFileSync('/opt/meet.idesk.lk/keys/ssl-cert-idesk.crt'),
  ca: fs.readFileSync('/opt/meet.idesk.lk/keys/bundle.crt')
}

/* ======================== Server ports ========================================== */

https.createServer(options, app).listen(config.port, function () {
  console.log("Https listening to port " + config.port);
});

/* ======================== Local ports =========================================== */
// app.listen(config.port, function () {
//   console.log('app listening on port ' + config.port);
// });

mongoose.connect(config.dbe);

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * main apis
 */
app.use('/api', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//enable CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
