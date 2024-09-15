const Card = require('./card');
const { Ability, Property } = require('./ability');
const { Buff, BuffProperty } = require('./buff');

class Game {
    constructor(pID, oID) {
        this.pID = pID; 
        this.oID = oID;
        this.playerHero = playerHero;
        this.oponentHero = oponentHero; 
        this.pHealth = 30;
        this.oHealth = 30;       
        this.turn = 0;
        this.round = 0;
        this.roundTimer = 30;
        this.turnTimer = 30;
        this.gold = 300;
        this.income = 200;                
        this.roundWinner = null;
        this.matchWinner = null;  
    }

    startGame(req, res) {
        res.redirect('/views/arena.html');
    }
}

module.exports = Game;