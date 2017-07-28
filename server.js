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

var numUsers = 0;

io.on("connection", function (socket) {
  var addedUser = false;
  console.log("co nguoi ket noi: " + socket.id);

  socket.on('add user', function (user) {
    if(user_arr.indexOf(user)>=0){
      // failed
      socket.emit("login failed");
    }else {
      // success
      user_arr.push(user)
      socket.username = user;
      addedUser = true;
      ++numUsers;
      socket.emit('login success', {
        username: user,
        numUsers: user_arr.length
      });

      // when the client emits 'typing', we broadcast it to others
      socket.on('typing', function () {
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
        numUsers: numUsers
      });

      // when the client emits 'new message', we broadcast it to others
      socket.on('new message', function (message) {
        socket.broadcast.emit('new message', {
          username: socket.username,
          message: message
        });
      });

      // when the user disconnects.. perform this
      socket.on('disconnect', function () {
        if (addedUser) {
          --numUsers;

          // echo globally that this client has left
          socket.broadcast.emit('user left', {
            username: socket.username,
            numUsers: numUsers
          });
        }
      });
    }
  })

})

app.get("/", function(req, res){
  res.render("index");
});
