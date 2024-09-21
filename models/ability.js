class Ability {
    constructor(ab_name, img, desc, type, behavior, level, maxlevel, property = {}) {
        this.ab_name = ab_name;
        this.img = img;
        this.desc = desc;
        this.type = type;
        this.behavior = behavior;
        this.level = level;
        this.maxlevel = maxlevel;
        this.property = property;
    }

    cast(target) {
        if (!this.isReady()) {
            throw new Error(`${this.ab_name} is on cooldown!`);
        }
        if (this.isActive()) {
            console.log(`${this.ab_name} cast on ${target.name}`);
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
        return this.property.cooldown === 0;
    }

    resetCooldown() {
        this.property.cooldown = this.property.cooldown;
    }

    upgrade() {
        if (this.level < this.maxlevel) {
            this.level += 1;
            this.property.dmg += 5;
            this.property.cooldown = Math.max(0, this.property.cooldown - 1);
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
        };
    }

    toString() {
        return `${this.ab_name} (Level: ${this.level}/${this.maxlevel}) - ${this.desc}`;
    }
}

class Property {
    constructor(dmg, cooldown, duration, manacost) {
        this.dmg = dmg;
        this.cooldown = cooldown;
        this.duration = duration;
        this.manacost = manacost;
    }

    reduceCooldown(amount) {
        this.cooldown = Math.max(0, this.cooldown - amount);
        console.log(`Cooldown reduced to ${this.cooldown}`);
    }

    isReady() {
        return this.cooldown === 0;
    }

    toString() {
        return `Damage: ${this.dmg}, Cooldown: ${this.cooldown}, Duration: ${this.duration}, Mana Cost: ${this.manacost}`;
    }
}

module.exports = { Ability, Property };
