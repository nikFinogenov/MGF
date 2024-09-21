class Card {
    constructor(he_name, hp, atk, mana, money, manaregen, hpregen, img, desc, level, maxlevel, abilities = [], buffs = []) {
        this.he_name = he_name; // Имя героя
        this.hp = hp; // Здоровье героя
        this.atk = atk; // Атака героя
        this.mana = mana; // Мана героя
        this.money = money;
        this.manaregen = manaregen; // Регенерация маны
        this.hpregen = hpregen; // Регенерация здоровья
        this.img = img; // Путь к изображению героя
        this.desc = desc; // Описание героя
        this.level = level; // Текущий уровень героя
        this.maxlevel = maxlevel; // Максимальный уровень героя
        this.abilities = abilities; // Способности героя (массив объектов Ability)
        this.buffs = buffs; // Баффы героя (массив объектов Buff)
    }

    useAttack(target) {
        let dealDamage = this.atk;
        target.recieveDamage(dealDamage);
        return dealDamage;
    }
    useAttackAbility(target, value) {
        // let dealDamage = this.atk;
        target.recieveDamage(value);
        return value;
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
        this.hp += hp;
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

    // Getter для здоровья героя
    get getHp() {
        return this.hp;
    }

    // Getter для атаки героя
    get getAtk() {
        return this.atk;
    }

    // Getter для маны героя
    get getMana() {
        return this.mana;
    }

    // Getter для регенерации маны
    get getManaregen() {
        return this.manaregen;
    }

    // Getter для регенерации здоровья
    get getHpregen() {
        return this.hpregen;
    }

    // Getter для уровня героя
    get getLevel() {
        return this.level;
    }
}

module.exports = Card;