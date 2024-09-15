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

    startGame() {
        try {
            // Загрузка данных из JSON
            const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'cards.json'), 'utf8'));

            // Создаем объекты Card для всех героев
            this.playerHero = this.createCard(data.hero_cards[0]); // Первый герой
            this.oponentHero = this.createCard(data.hero_cards[1]); // Второй герой

            // Проверяем заполнение данных
            console.log('Player Hero:', this.playerHero);
            console.log('Opponent Hero:', this.oponentHero);

            // Пример атаки
            const damageDealt = this.playerHero.useAttack(this.oponentHero);
            console.log(`Player Hero attacked Opponent Hero for ${damageDealt} damage.`);

            console.log('Player Hero:', this.playerHero);
            console.log('Opponent Hero:', this.oponentHero);
            
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