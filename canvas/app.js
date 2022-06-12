var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mainRouter  = require('./routes/main');
var hello = require('./routes/hello');
var testRouter = require('./routes/test');

var app = express();

const session = require('express-session'); //☆



var session_opt = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 }
};
app.use(session(session_opt));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/main',mainRouter);
app.use('/hello', hello);
app.use('/test',testRouter);
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
  res.render('error');
});




//ソケット通信を受け取ったら全体に送信

/*
var http = require('http').Server(app);
const io = require('socket.io')(http);
*/


/*
const server =app.listen(app.get("port"),()=>
  console.log(`Server runnig at http://localhost: ${app.get("port")}`)
);
*/

//サーバのインスタンスをsocket.ioに渡す

var io = require('socket.io')();
app.io=io;


io.on('connection',function(socket){
    console.log('connected');




    socket.on('message', (data) => {
        //console.log('message', data);
        socket.broadcast.emit("message",data)
    });



});

//  console.log(`Server runnig at http://localhost: ${app.get("port")}`)



/*
io.listen(app.get("port"),()=>
  console.log(`Server runnig at http://localhost: ${app.get("port")}`)
);

*/


/*

  //ユーザの接続断を監視する
  io.on("disconnect",()=>{
    console.log("user disconnected");
  });
*/
  /*
  //クライアント入力の監視
  io.on("message",function(data)=>{
    //接続中の全ユーザにメッセージをブロードキャスト
    io.emit(data);
  })
*/







//var socket_io    = require( "socket.io" );
//var io           = socket_io();
//app.io           = io;





/*
app.io.on('connection', function(client) {
  client.on('message', function(data) {
    client.broadcast.emit(data);
  });
});
*/

module.exports = app;
