class Ability {
    constructor(ab_name, img, desc, type, behavior, level, maxlevel, property = {}) {
        this.ab_name = ab_name; // Имя способности
        this.img = img; // Путь к изображению способности
        this.desc = desc; // Описание способности
        this.type = type; // Тип способности (например, прямой урон)
        this.behavior = behavior; // Поведение способности (активная, пассивная)
        this.level = level; // Текущий уровень способности
        this.maxlevel = maxlevel; // Максимальный уровень способности
        this.property = property; // Свойства способности (например, урон, кулдаун, манакост)
    }

    cast(target) {
        if (!this.isReady()) {
            throw new Error(`${this.ab_name} is on cooldown!`);
        }
        if (this.isActive()) {
            // Логика активации способности
            console.log(`${this.ab_name} cast on ${target.name}`);
            // Обработка урона или других эффектов
            target.takeDamage(this.property.dmg);
            this.resetCooldown();
        } else {
            console.log(`${this.ab_name} is passive and does not need to be cast.`);
        }
    }

    isActive() {
        return this.behavior === "active";
    }

    isPassive() {
        return this.behavior === "passive";
    }

    isReady() {
        return this.property.cooldown === 0; // Проверка готовности способности
    }

    resetCooldown() {
        this.property.cooldown = this.property.cooldown; // Сброс кулдауна
    }

    upgrade() {
        if (this.level < this.maxlevel) {
            this.level += 1;
            // Логика повышения уровня (например, увеличение урона, уменьшение кулдауна)
            this.property.dmg += 5; // Пример повышения урона
            this.property.cooldown = Math.max(0, this.property.cooldown - 1); // Уменьшение кулдауна
            console.log(`${this.ab_name} upgraded to level ${this.level}.`);
        } else {
            console.log(`${this.ab_name} is already at max level.`);
        }
    }

    getInfo() {
        return {
            name: this.ab_name,
            description: this.desc,
            level: this.level,
            maxLevel: this.maxlevel,
            type: this.type,
            properties: this.property
        }; // Получение информации о способности
    }

    toString() {
        return `${this.ab_name} (Level: ${this.level}/${this.maxlevel}) - ${this.desc}`; // Человекочитаемое представление
    }
}

class Property {
    constructor(dmg, cooldown, duration, manacost) {
        this.dmg = dmg; // Урон способности
        this.cooldown = cooldown; // Кулдаун способности
        this.duration = duration; // Длительность действия способности (если есть)
        this.manacost = manacost; // Стоимость маны
    }

    reduceCooldown(amount) {
        this.cooldown = Math.max(0, this.cooldown - amount); // Уменьшение кулдауна
        console.log(`Cooldown reduced to ${this.cooldown}`);
    }

    isReady() {
        return this.cooldown === 0; // Проверка готовности способности
    }

    toString() {
        return `Damage: ${this.dmg}, Cooldown: ${this.cooldown}, Duration: ${this.duration}, Mana Cost: ${this.manacost}`; // Человекочитаемое представление
    }
}

module.exports = { Ability, Property };
