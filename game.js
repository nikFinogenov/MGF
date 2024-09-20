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
        this.player2Hero = null;
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

    InputCards(heroName, opHeroName) {
        try {
            // Загрузка данных из JSON
            const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'json/cards.json'), 'utf8'));
            const cardData = data.hero_cards.find(card => card.he_name === heroName);
            const opCardData = data.hero_cards.find(card => card.he_name === opHeroName);

            if (!cardData || !opCardData) {
                throw new Error('Не удалось найти данные о героях');
            }

            // Создаем карты для обоих игроков
            this.playerHero = this.createCard(cardData);
            this.player2Hero = this.createCard(opCardData);
            console.log(this.playerHero);
            console.log(this.player2Hero);

        } catch (error) {
            console.error('Error loading JSON data:', error);
        }
    }

    AttackEvent(attackerName, targetName) {
        // Проверяем, кто является атакующим и целью
        let attacker;
        let target;
    
        // Проверка, кто из игроков атакует
        if (this.playerHero.getName === attackerName) {
            attacker = this.playerHero;
        } else if (this.player2Hero.getName === attackerName) {
            attacker = this.player2Hero;
        } else {
            throw new Error(`Карта с именем ${attackerName} не найдена среди игроков`);
        }
    
        // Проверка, кто является целью атаки
        if (this.playerHero.getName === targetName) {
            target = this.playerHero;
        } else if (this.player2Hero.getName === targetName) {
            target = this.player2Hero;
        } else {
            throw new Error(`Карта с именем ${targetName} не найдена среди игроков`);
        }
    
        // Выполняем атаку
        let damage = attacker.useAttack(target);
        return damage;
    }

    SendCurrentHp(sender) {
        let target;
        if (this.playerHero.getName === sender) {
            target = this.playerHero;
        } else if (this.player2Hero.getName === sender) {
            target = this.player2Hero;
        } else {
            throw new Error(`Карта с именем ${sender} не найдена среди игроков`);
        }
        return target.getHp();
    }

    createCard(heroData) {
        return new Card(
            heroData.he_name,
            parseInt(heroData.hp),
            parseInt(heroData.atk),
            parseInt(heroData.mana),
            parseInt(heroData.money),
            parseInt(heroData.manaregen),
            parseInt(heroData.hpregen),
            heroData.img,
            heroData.desc,
            parseInt(heroData.level),
            parseInt(heroData.maxlevel),
            heroData.abilities.map(ab => new Ability(
                ab.ab_name,
                ab.img,
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