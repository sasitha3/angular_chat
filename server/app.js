var express = require('express');
var path = require('path');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');
var config = require('./constant/config');
var routes = require('./routes/api.routes');
var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.use(cors());

const users = [];
const messages = [];
let currentId = 0;

var mongoose = require('mongoose');

/* ======================== Local ports =========================================== */
app.listen(config.port, function () {
  console.log('app listening on port ' + config.port);
});

/* ======================== Socket Connection =========================================== */
io.on("connection", function(socket) {
  console.log("LOG:: a user connected");
  socket.emit("get users list", JSON.stringify(users));
  socket.emit("get messages history", JSON.stringify(messages));

  socket.on("message", function(msg) {
    console.log('*** line 1');
    console.log(
      "LOG:: message from UserId: " + msg.userId + " --> " + msg.text
    );
    const message = {
      ...msg,
      timestamp: new Date()
    };
    messages.push(message);
    console.log(messages);
    io.emit("message", JSON.stringify(message));
  });

  socket.on("user name added", function(data) {
    console.log("LOG:: user '" + data.name + "' entered the room");
    
    console.log(users);
    // console.log(name);
    const { length } = users;
    const ids = length + 1;
    const found = users.some(el => el.name === data.name);
    if (!found) users.push({
      name:data.name,
      id: data.id,
      isCurrent: false
    });
    socket.emit("my user added", JSON.stringify(users));
    io.emit("user name added", JSON.stringify(users));
  });

  socket.on("disconnect", function(name) {
    console.log("LOG:: user disconnected");
    console.log(name);
  });
  
  socket.on('room', room => {
    socket.join(room);
    console.log(room);
 })

});
/* ======================== End socket   ==========================================  */

/* ======================== Socket ports =========================================== */
http.listen(3000, function() {
  console.log("LOG:: listening on *:3000");
});

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
