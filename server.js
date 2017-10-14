'use strict';

let http = require('http');
let express = require('express');
let socketio = require('socket.io');

let app = express();
let server = http.createServer(app);
let io = socketio(server);

// sock --> sending between client/server
io.on('connection',(sock) => sock.emit('msg','Hello!'));

app.use(express.static(__dirname+'/client'));
server.listen(8080,() => console.log('Ready to work'));