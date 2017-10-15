'use strict';

class Game {
    constructor(sock1, sock2) {
        this._players = [sock1, sock2];

        this._initSockets();
    }

    _initSockets() {
        var gifferTurn = 0;

        this._players.forEach((sock, index) => {
            if (index == gifferTurn) {
                sock.emit('sysNotif', 'Phrase: insert random phrase here');
            }
            else {
                sock.emit('sysNotif', 'Guess that phrase!');
            }
        });
    }

    _turn() {

    }

    _choosePhrase() {

    }
}

module.exports = Game;