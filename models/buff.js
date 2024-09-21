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
}

module.exports = { Buff };