'use strict';

let fs = require('fs');
// console.log(phrases);

class Game {
    constructor(sock1, sock2) {
        this._players = [sock1, sock2];

        this._initSockets();
        this._countdown = 5;

    }

    _initSockets() {
        var gifferTurn = 0;
        var self = this;
        var phrase = this._choosePhrase();

        var counting = setInterval(function() {  
            if (self._countdown > 0) { 
            self._countdown--;}

            console.log(self._countdown);
        
            self._players.forEach((sock, index) => {
                sock.emit('timer', self._countdown);
                if (self._countdown == 0){
                    clearInterval(counting);
                }
            });

        }, 1000);

        this._players.forEach((sock, index) => {
            if (index == gifferTurn) {
                sock.emit('sysNotif', 'Phrase: ' + phrase);
            }
            else {
                sock.emit('sysNotif', 'Guess that phrase!');
            }
        });
    }

    _turn(playerIndex) {

    }

    _choosePhrase() {
        var phrases = fs.readFileSync('client/phrases.txt').toString().split('\n');
        var numPhrases = phrases.length;
        var rand = Math.floor(Math.random() * numPhrases);

        // console.log(phrases)
        return phrases[rand];
    }

}

module.exports = Game;