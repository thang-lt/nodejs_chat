var express = require("express");
var app = express();
var user_arr = [];

// Routing
app.use(express.static("js"));
app.use(express.static("css"));

app.set("view engine", "ejs");
app.set("views", "./views");

var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3001);

io.on("connection", function (socket) {
  console.log("co nguoi ket noi: " + socket.id);

  socket.on('add user', function (user) {
    console.log('vao add user');
    if(user_arr.indexOf(user)>=0){
      // failed
      console.log('add user failed');
      socket.emit("login failed");
    }else {
      // success
      console.log('add user success');
      user_arr.push(user)
      socket.username = user;

      socket.emit('login success', {
        username: user,
        numUsers: user_arr.length
      });

      // when the client emits 'typing', we broadcast it to others
      socket.on('typing', function () {
        console.log('nhan dc emit typing');
        socket.broadcast.emit('typing', {
          username: socket.username
        });
      });

      // when the client emits 'stop typing', we broadcast it to others
      socket.on('stop typing', function () {
        socket.broadcast.emit('stop typing', {
          username: socket.username
        });
      });

      // echo globally (all clients) that a person has connected
      socket.broadcast.emit('user joined', {
        username: user,
        numUsers: user_arr.length
      });

    }
  })

})

app.get("/", function(req, res){
  res.render("index");
});
