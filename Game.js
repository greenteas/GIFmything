'use strict';

let fs = require('fs');
// console.log(phrases);

class Game {
    constructor(sock1, sock2, playerData) {
        this._players = [sock1, sock2];
        this._playerData = playerData;
        this._initSockets();
        this._countdown = 60;
        this._gameEnd = false;

    }

    _initSockets() {
        var gifferTurn = 0;
        var self = this;
        var phrase = this._choosePhrase();
        var phraseList = phrase.split(" ");
        var phraseBlanks = this._getBlanks(phrase);

        self._players.forEach((sock) => {
            self._addTurnEvent(sock, phrase, phraseBlanks, self);
        });
        
        var counting = setInterval(function() {  
            if (self._countdown > 0 && self._gameEnd == false) { 
            self._countdown--;
            }


            console.log(self._countdown);
        
            self._players.forEach((sock, index) => {
                sock.emit('timer', self._countdown);
                if (self._countdown == 0){
                    clearInterval(counting);
                    self._gameEnd = true;
                }
            });
        }, 1000);

        this._players.forEach((sock, index) => {
            if (index == gifferTurn) {
                sock.emit('sysNotif', phrase);
                sock.emit('phraseChange', phrase);
            }
            else {
                sock.emit('sysNotif', 'Guess that phrase!');
                sock.emit('phraseChange', phraseBlanks.join(" "));
            }
        });

    }

    _addTurnEvent(sock,phrase,answersSoFar,self) {
        sock.on('guess', checkGuess);

        function checkGuess(data){
            var guessWords = data.value.split(' ');
            var phraseWords = phrase.toLowerCase().split(' ');

            var blankUpdate = answersSoFar;
            for (var i = 0, answer; answer = phraseWords[i]; i++) {
                if (blankUpdate[i] != "________") {
                    continue;
                }

                var isCorrect = false;

                for (var j = 0, word; word = guessWords[j]; j++) {
                    if (answer == word) {
                        blankUpdate[i] = answer;
                        isCorrect = true;
                        break;
                    }
                }
            }
            sock.emit('phraseChange', blankUpdate.join(" "));

            var isEndGame = true;
            for (var i = 0, word; word = blankUpdate[i]; i++) {
                if (word == "________") {
                    isEndGame = false;
                    break;
                }
            }

            if (isEndGame) {
                self._gameEnd = true;
                self._playerData["score"] += 1;
                sock.emit("globalPlayers", self._playerData);
                console.log("winner!!");
            }
        }
    }

    _choosePhrase() {
        var phrases = fs.readFileSync('client/phrases.txt').toString().split('\n');
        var numPhrases = phrases.length;
        var rand = Math.floor(Math.random() * numPhrases);

        // console.log(phrases)
        return phrases[rand];
    }

    _getBlanks(phrase){
        var phraseAsList = phrase.split(" ");
        var blanks = [];

        phraseAsList.forEach((word) => {blanks.push("________");});

        return blanks;
    }

}

module.exports = Game;