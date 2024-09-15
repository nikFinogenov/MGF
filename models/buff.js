class Buff {
    constructor(bf_name, desc, img, type, target, stackable, price, rarity, level, maxlevel, property = []) {
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
        this.property = property; // Свойства баффа (например, увеличение урона)
    }
}

class BuffProperty {
    constructor(dmg, hp, cooldown, duration) {
        this.dmg = dmg; // Увеличение урона баффом
        this.hp = hp; // Увеличение здоровья баффом
        this.cooldown = cooldown; // Время кулдауна
        this.duration = duration; // Длительность баффа
    }
}

module.exports = { Buff, BuffProperty };