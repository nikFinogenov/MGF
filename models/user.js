// const Model = require('../model');
const db = require('../db');

class User {
    constructor(attributes = {}) {
        // super('users', attributes);
        this.login = attributes.login || '';
        this.password = attributes.password || ''; 
        this.full_name = attributes.full_name || '';
        this.email = attributes.email || '';
        this.status = '';
        this.id = -1;
    }
    clear() {
        this.attributes = {};
        this.id = -1;
        this.login = '';
        this.password = '';
        this.full_name = '';
        this.email = '';
        this.status = '';
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

    async getUserByEmail() {
        const [rows] = await db.query(`SELECT * FROM users WHERE email = ? LIMIT 1`, [this.email]);
        if (rows.length > 0) {
            this.attributes = rows[0];
            this.password = this.attributes.password;
        } else {
            throw new Error(`Not found`);
        }
    }
    async getUser() {
        const [rows] = await db.query(`SELECT * FROM users WHERE login = ? AND password = ? LIMIT 1`, [this.login, this.password]);
        if (rows.length > 0) {
            this.attributes = rows[0];
            this.full_name = this.attributes.full_name;
            this.email = this.attributes.email;
            this.status = this.attributes.status;
            this.id = this.attributes.id;
        } else {
            throw new Error(`Does not match`);
        }
    }
}

module.exports = User;
