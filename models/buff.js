class Buff {
    constructor(bf_name, desc, img, type, target, stackable, price, rarity, level, maxlevel, dmg, hp, hpregen, mana, manaregen, cooldown, duration) {
        this.bf_name = bf_name;
        this.desc = desc;
        this.img = img;
        this.type = type;
        this.target = target;
        this.stackable = stackable;
        this.price = price;
        this.rarity = rarity;
        this.level = level;
        this.maxlevel = maxlevel;
        this.dmg = dmg;
        this.hp = hp;
        this.hpregen = hpregen;
        this.mana = mana;
        this.manaregen = manaregen;
        this.cooldown = cooldown;
        this.duration = duration;
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
        targetCharacter.addBuff(this);
        setTimeout(() => this.deactivate(targetCharacter), this.duration * 1000);
    }

    deactivate(targetCharacter) {
        if (!this.active) return;
        this.active = false;
        targetCharacter.removeBuff(this);
        console.log(`${this.bf_name} has been removed from ${targetCharacter.name}.`);
    }

    resetCooldown() {
        this.cooldownTimer = this.cooldown;
    }

    updateCooldown(deltaTime) {
        if (this.cooldownTimer > 0) {
            this.cooldownTimer -= deltaTime;
            if (this.cooldownTimer < 0) {
                this.cooldownTimer = 0;
            }
        }
    }

    isReady() {
        return this.cooldownTimer === 0;
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
        };
    }

    toString() {
        return `${this.bf_name} (Level: ${this.level}/${this.maxlevel}) - ${this.desc}`;
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
        this.duration = Math.max(0, this.duration - amount);
        console.log(`${this.bf_name} duration reduced to ${this.duration} seconds.`);
    }

    canStack() {
        return this.stackable;
    }
}

module.exports = { Buff };
