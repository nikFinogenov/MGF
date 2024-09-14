const db = require('../db');

class Model {
    constructor(table, attributes = {}) {
        this.table = table;
        this.attributes = attributes;
    }

    async find(id) {
        try {
            const [rows] = await db.query(`SELECT * FROM ?? WHERE id = ? LIMIT 1`, [this.table, id]);

            if (rows.length > 0) {
                this.attributes = rows[0];
                return this;
            } else {
                throw new Error(`Record with ID ${id} not found in table ${this.table}`);
            }
        } catch (error) {
            throw new Error(`Error finding record: ${error.message}`);
        }
    }

    async delete() {
        if (!this.attributes.id) {
            throw new Error("Cannot delete a record without an ID.");
        }

        try {
            const [result] = await db.query(`DELETE FROM ?? WHERE id = ?`, [this.table, this.attributes.id]);

            if (result.affectedRows === 0) {
                throw new Error(`Record with ID ${this.attributes.id} not found in table ${this.table}`);
            }

            this.attributes = {};
        } catch (error) {
            throw new Error(`Error deleting record: ${error.message}`);
        }
    }

    async save() {
        if (this.attributes.id) {
            const { id, ...fields } = this.attributes;
            try {
                const [result] = await db.query(`UPDATE ?? SET ? WHERE id = ?`, [this.table, fields, id]);

                if (result.affectedRows === 0) {
                    throw new Error(`Record with ID ${id} not found for update in table ${this.table}`);
                }
            } catch (error) {
                throw new Error(`Error updating record: ${error.message}`);
            }
        } else {
            try {
                const [res] = await db.query(`INSERT INTO ?? SET ?`, [this.table, this.attributes]);
                this.attributes.id = res.insertId;
            } catch (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    throw new Error('Duplicate entry error');
                }
                throw new Error(`Error saving record: ${error.message}`);
            }
        }
    }
}

module.exports = Model;
