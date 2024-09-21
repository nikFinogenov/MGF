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
        this.dmg = dmg;
        this.cooldown = cooldown;
        this.duration = duration;
        this.manacost = manacost;
    }
}

module.exports = { Ability, Property };