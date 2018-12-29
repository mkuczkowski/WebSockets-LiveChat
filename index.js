const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let currentUsers = 0;

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    io.emit('users info', ++currentUsers);
    io.emit('chat message', currentUsers);
    console.log('user connected');
    socket.on('chat message', function(msg) {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    })
    socket.on('disconnect', function(){
        io.emit('users info', --currentUsers);
        console.log('user disconnected');
        io.emit('chat message', "User disconnected");
    });
})

http.listen(3000, function() {
  console.log('Listening on port 3000...');
});