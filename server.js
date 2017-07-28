var express = require("express");
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 3001;

// Routing
app.use(express.static("js"));
app.use(express.static("css"));

app.set("view engine", "ejs");
app.set("views", "./views");

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.get("/", function(req, res){
  res.render("index");
});
