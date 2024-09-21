class Card {
    constructor(he_name, hp, atk, mana, money, manaregen, hpregen, img, desc, level, maxlevel, abilities = [], buffs = []) {
        this.he_name = he_name;
        this.hp = hp;
        this.basehp = hp;
        this.atk = atk;
        this.mana = mana;
        this.money = money;
        this.manaregen = manaregen;
        this.hpregen = hpregen;
        this.img = img;
        this.desc = desc;
        this.level = level;
        this.maxlevel = maxlevel;
        this.abilities = abilities;
        this.buffs = buffs;
    }

    useAttack(target, defense) {
        let dealDamage = this.atk * defense;
        target.recieveDamage(Math.round(dealDamage));
        return dealDamage;
    }
    useAttackAbility(target, value, defense) {
        target.recieveDamage(Math.round(value * defense));
        return Math.round(value * defense);
    }
    useHealkAbility(value) {
        this.recieveHeal(value);
        return value;
    }

    lvlUp() {
        if (this.level < this.maxlevel) {
            this.level += 1;
            this.addAtk(1);
            this.addHp(3);
            this.addMana(1);
            if (this.level % 5 === 0) {
                this.addAtk(2);
                this.addHp(4);
                this.addHpRegen(2);
                this.addMana(3);
                this.addManaRegen(1);
            }
        } else {
            return;
        }
    }

    useSpell(index) {
        if (index < 0 || index >= this.abilities.length) {
            throw new Error('Invalid ability index');
        }

        const ability = this.abilities[index];

        ability.Cast();
    }

    addHp(hp) {
        this.basehp += hp;
        this.hp = this.hp;
        return this.hp;
    }

    addAtk(atk) {
        this.atk += atk;
        return this.atk;
    }

    addMana(mana) {
        this.mana += mana;
        return this.mana;
    }

    addManaRegen(manaregen) {
        this.manaregen += manaregen;
        return this.manaregen;
    }

    addHpRegen(hpregen) {
        this.hpregen += hpregen;
        return this.hpregen;
    }

    recieveDamage(dmg) {
        this.hp -= dmg;

        if (this.hp < 0) {
            this.hp = 0;
        }

        return this.hp;
    }
    recieveHeal(value) {
        this.hp += value;

        return this.hp;
    }

    addBuff(buff) {
        this.buffs.push(buff);
    }

    get getName() {
        return this.he_name;
    }

    get getHp() {
        return this.hp;
    }

    set setHp(newHp) {
        this.hp = newHp;
    }

    get getBaseHp() {
        return this.basehp;
    }

    get getAtk() {
        return this.atk;
    }

    get getMana() {
        return this.mana;
    }

    get getManaregen() {
        return this.manaregen;
    }

    get getHpregen() {
        return this.hpregen;
    }

    get getLevel() {
        return this.level;
    }
}

module.exports = Card;