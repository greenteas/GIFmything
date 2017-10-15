'use strict';

class Game {
    constructor(sock1, sock2) {
        this._players = [sock1, sock2]; //[[sock1, person1, ], [sock2, person2]];

        this._initSockets();
        this._countdown = 5;

    }

    _initSockets() {
        var gifferTurn = 0;
        var self = this;

        var counting = setInterval(function() {  
            if (self._countdown > 0){ 
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
                sock.emit('msg', 'Phrase: insert random phrase here');
            }
            else {
                sock.emit('msg', 'Guess that phrase!');
            }
        });
    }

    _turn() {

    }
    _choosePhrase() {

    }

}

module.exports = Game;