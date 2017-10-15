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
let playerData = [];

// sock --> sending between client/server
io.on('connection', onConnection);

app.use(express.static(__dirname+'/client'));
server.listen(8080,() => console.log('Ready to work'));

function onConnection(sock) {
    sock.emit('sysNotif', 'Hello! Get ready for a round of GIF My Thing!');

    // whenever the client sends a message, send txt to all clients
    sock.on('playerUpdate', function(data) {
    	playerData.push(data);
    	// console.log(playerData);
    	io.emit('globalPlayers', playerData);
    });

    sock.on('msg', (txt) => io.emit('msg', txt));
    if (waitingPlayer) {
        new Game(waitingPlayer, sock, playerData);
        waitingPlayer = null;
    }
    else {
        waitingPlayer = sock;
        sock.emit('sysNotif', 'You are waiting for a second player.');
    }
}

