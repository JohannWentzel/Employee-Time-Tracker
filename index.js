/**
 * Created by Marius on 3/25/2017.
 */
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var port = process.env.PORT || 8080;

http.listen( port, function () {
    console.log('listening on port', port);
});

app.use(express.static(__dirname + '/public'));

// Routing to login page
app.get('/*', function(req, res){
  res.sendFile(__dirname + '/public/login.html');
});
