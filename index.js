const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

let currentUsers = 0;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    socket.broadcast.emit('connected');
    io.emit('users info', ++currentUsers);
    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
    });
    socket.on('disconnect', function(){
        io.emit('users info', --currentUsers);
        io.emit('disconnected');
    });
    socket.on('user typing', function() {
        socket.broadcast.emit('user typing');
    });
    socket.on('user not typing', function() {
        socket.broadcast.emit('user not typing');
    });
});

http.listen(3000, function() {
  console.log('Listening on port 3000...');
});