'use strict';

let http = require('http');
let express = require('express');
let socketio = require('socket.io');
let Game = require('./Game');
let giphy = require( 'giphy' )( 'dc6zaTOxFJmzC' );

let app = express();
let server = http.createServer(app);
let io = socketio(server);

let waitingPlayer;

// sock --> sending between client/server
io.on('connection', onConnection);

app.use(express.static(__dirname+'/client'));
server.listen(8080,() => console.log('Ready to work'));

function onConnection(sock) {
    sock.emit('msg', 'Hello! Get ready for a round of GIF My Thing!');
    // whenever the client sends a message, send txt to all clients
    sock.on('msg', (txt) => io.emit('msg', txt));
    if (waitingPlayer) {
        new Game(waitingPlayer, sock);
        waitingPlayer = null;
    }
    else {
        waitingPlayer = sock;
        sock.emit('msg', 'You are waiting for a second player.');
    }
}

