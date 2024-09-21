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
        this.cooldownTimer = 0; // Таймер кулдауна
        this.active = false; // Статус активации баффа
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

    activate(targetCharacter) {
        if (this.active) {
            throw new Error(`${this.bf_name} is already active.`);
        }
        this.active = true;
        this.resetCooldown();
        targetCharacter.addBuff(this); // Добавляем бафф к цели
        setTimeout(() => this.deactivate(targetCharacter), this.duration * 1000); // Деактивируем после заданного времени
    }

    deactivate(targetCharacter) {
        if (!this.active) return;
        this.active = false;
        targetCharacter.removeBuff(this); // Убираем бафф у цели
        console.log(`${this.bf_name} has been removed from ${targetCharacter.name}.`);
    }

    resetCooldown() {
        this.cooldownTimer = this.cooldown; // Сбросить таймер кулдауна
    }

    updateCooldown(deltaTime) {
        if (this.cooldownTimer > 0) {
            this.cooldownTimer -= deltaTime;
            if (this.cooldownTimer < 0) {
                this.cooldownTimer = 0; // Не может быть меньше 0
            }
        }
    }

    isReady() {
        return this.cooldownTimer === 0; // Проверка готовности баффа
    }

    getInfo() {
        return {
            name: this.bf_name,
            description: this.desc,
            level: this.level,
            maxLevel: this.maxlevel,
            damage: this.dmg,
            hp: this.hp,
            mana: this.mana,
            cooldown: this.cooldown,
            duration: this.duration,
            rarity: this.rarity,
            active: this.active
        }; // Получение информации о баффе
    }

    toString() {
        return `${this.bf_name} (Level: ${this.level}/${this.maxlevel}) - ${this.desc}`; // Человекочитаемое представление
    }

    upgrade() {
        if (this.level < this.maxlevel) {
            this.level += 1;
            console.log(`${this.bf_name} upgraded to level ${this.level}.`);
        } else {
            console.log(`${this.bf_name} is already at max level.`);
        }
    }

    reduceDuration(amount) {
        this.duration = Math.max(0, this.duration - amount); // Уменьшить длительность, не позволяя отрицательным значениям
        console.log(`${this.bf_name} duration reduced to ${this.duration} seconds.`);
    }

    canStack() {
        return this.stackable; // Проверка, можно ли накапливать бафф
    }
}

module.exports = { Buff };
