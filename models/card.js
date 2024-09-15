class Card {
    constructor(he_name, hp, atk, mana, manaregen, hpregen, img, desc, level, maxlevel, abilities = [], buffs = []) {
        this.he_name = he_name; // Имя героя
        this.hp = hp; // Здоровье героя
        this.atk = atk; // Атака героя
        this.mana = mana; // Мана героя
        this.manaregen = manaregen; // Регенерация маны
        this.hpregen = hpregen; // Регенерация здоровья
        this.img = img; // Путь к изображению героя
        this.desc = desc; // Описание героя
        this.level = level; // Текущий уровень героя
        this.maxlevel = maxlevel; // Максимальный уровень героя
        this.abilities = abilities; // Способности героя (массив объектов Ability)
        this.buffs = buffs; // Баффы героя (массив объектов Buff)
    }
}

module.exports = Card;