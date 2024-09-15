class Buff {
    constructor(bf_name, desc, img, type, target, stackable, price, rarity, level, maxlevel, dmg, hp, hpregen, mana, manaregen, cooldown, duration) {
        this.bf_name = bf_name; // Имя баффа
        this.desc = desc; // Описание баффа
        this.img = img; // Путь к изображению баффа
        this.type = type; // Тип баффа (например, усиление)
        this.target = target; // Цель баффа (например, герой)
        this.stackable = stackable; // Можно ли накапливать бафф
        this.price = price; // Цена баффа
        this.rarity = rarity; // Редкость баффа
        this.level = level; // Текущий уровень баффа
        this.maxlevel = maxlevel; // Максимальный уровень баффа
        this.dmg = dmg; // Увеличение урона баффом
        this.hp = hp; // Увеличение здоровья баффом
        this.hpregen = hpregen; // Регенерация здоровья
        this.mana = mana; // Мана героя
        this.manaregen = manaregen; // Регенерация маны
        this.cooldown = cooldown; // Время кулдауна
        this.duration = duration; // Длительность баффа
    }

    applyBuffBonusCard(targetCard) {
        if (!(targetCard instanceof Card)) {
            throw new Error("Target must be an instance of Card");
        }
        if (this.level < this.maxlevel) {
            this.level += 1;
            targetCard.addAtk(this.dmg);
            targetCard.addHp(this.hp);
            targetCard.addMana(this.mana);
            targetCard.addManaRegen(this.manaregen);
            targetCard.addHpRegen(this.hpregen);
        }
    }
}

module.exports = { Buff };