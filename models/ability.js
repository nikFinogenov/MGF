class Ability {
    constructor(ab_name, img, desc, type, behavior, level, maxlevel, property = {}) {
        this.ab_name = ab_name; // Имя способности
        this.img = img;
        this.desc = desc; // Описание способности
        this.type = type; // Тип способности (например, прямой урон)
        this.behavior = behavior; // Поведение способности (активная, пассивная)
        this.level = level; // Текущий уровень способности
        this.maxlevel = maxlevel; // Максимальный уровень способности
        this.property = property; // Свойства способности (например, урон, кулдаун, манакост)
    }

    Cast() {

    }

    isActive() {
        return this.behavior === "active";
    }
    
    isPassive() {
        return this.behavior === "passive";
    }
    
}

class Property {
    constructor(dmg, cooldown, duration, manacost) {
        this.dmg = dmg; // Урон способности
        this.cooldown = cooldown; // Кулдаун способности
        this.duration = duration; // Длительность действия способности (если есть)
        this.manacost = manacost; // Стоимость маны
    }
}

module.exports = { Ability, Property };