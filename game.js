const fs = require('fs');
const path = require('path');
const Card = require('./models/card');
const { Ability } = require('./models/ability');
const { Buff } = require('./models/buff');

class Game {
    constructor(pID, oID) {
        this.pID = pID; 
        this.oID = oID;
        this.playerHero = null;
        this.oponentHero = null; 
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

    startGame(heroName, opHeroName) {
        try {
            // Загрузка данных из JSON
            const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'json/cards.json'), 'utf8'));
            let card = new Card(heroName,);
            let opCard = new Card(opHeroName,);


            
        } catch (error) {
            console.error('Error loading JSON data:', error);
        }
    }

    createCard(heroData) {
        return new Card(
            heroData.he_name,
            parseInt(heroData.hp),
            parseInt(heroData.atk),
            parseInt(heroData.mana),
            parseInt(heroData.manaregen),
            parseInt(heroData.hpregen),
            heroData.img,
            heroData.desc,
            parseInt(heroData.level),
            parseInt(heroData.maxlevel),
            heroData.abilities.map(ab => new Ability(
                ab.ab_name,
                ab.desc,
                ab.type,
                ab.behavior,
                parseInt(ab.level),
                parseInt(ab.maxlevel),
                ab.property.map(p => ({
                    dmg: parseInt(p.dmg),
                    cooldown: parseInt(p.cooldown),
                    duration: parseInt(p.duration),
                    manacost: parseInt(p.manacost) || 0
                }))
            )),
            heroData.buffs // Предположим, что баффы будут обработаны аналогично
        );
    }
}

module.exports = Game;