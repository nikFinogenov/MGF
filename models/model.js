const db = require('../db');

class Model {
    constructor(table, attributes = {}) {
        this.table = table;
        this.attributes = attributes;
    }


}

module.exports = Model;
