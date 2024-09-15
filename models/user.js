// const Model = require('../model');
const db = require('../db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class User {
    constructor(name, email, password) {
        // super('users', attributes);
        this.name = name || '';
        this.email = email || '';
        this.password = password || '';
        // this.full_name = attributes.full_name || '';
        // this.status = '';
        this.id = -1;
    }
    clear() {
        this.name = '';
        this.password = '';
        this.email = '';
        this.id = -1;
    }
    //     async find(id) {
    //       try {
    //           const [rows] = await db.query(`SELECT * FROM users WHERE id = ? LIMIT 1`, [id]);

    //           if (rows.length > 0) {
    //               this.attributes = rows[0];
    //               return this;
    //           } else {
    //               throw new Error(`Record with ID ${id} not found in table ${this.table}`);
    //           }
    //       } catch (error) {
    //           throw new Error(`Error finding record: ${error.message}`);
    //       }
    //   }

    async delete() {
        if (!this.id || this.id === -1) {
            throw new Error("Cannot delete a record without an ID.");
        }

        try {
            const [result] = await db.query(`DELETE FROM users WHERE id = ?`, [this.id]);

            if (result.affectedRows === 0) {
                throw new Error(`Record with ID ${this.id} not found in table users`);
            }

        } catch (error) {
            throw new Error(`Error deleting record: ${error.message}`);
        }
    }

    async save() {
        return new Promise((resolve, reject) => {
            // console.log(this.password);
            bcrypt.hash(this.password, saltRounds, async (err, hash) => {
                if (err) {
                    return reject(new Error('Error occurred during registration. Please try again.'));
                }

                let attributes = { name: this.name, email: this.email, password: hash };

                if (this.id !== -1) {
                    try {
                        if (this.password === '')
                            attributes = { name: this.name, email: this.email };
                        const [result] = await db.query(`UPDATE users SET ? WHERE id = ?`, [attributes, this.id]);

                        if (result.affectedRows === 0) {
                            // console.log("qwe");
                            return reject(new Error(`Record with ID ${this.id} not found for update in table users`));
                        }

                        resolve(result); // Если всё успешно
                    } catch (error) {
                        if (error.code === 'ER_DUP_ENTRY') {
                            reject(new Error('Duplicate'));
                        } else {
                            reject(new Error(`Error saving record: ${error.message}`));
                        }
                    }
                } else {
                    try {
                        const [res] = await db.query(`INSERT INTO users SET ?`, [attributes]);
                        this.id = res.insertId;
                        resolve(res);
                    } catch (error) {
                        if (error.code === 'ER_DUP_ENTRY') {
                            reject(new Error('Duplicate'));
                        } else {
                            reject(new Error(`Error saving record: ${error.message}`));
                        }
                    }
                }
            });
        });
    }

    async savePass(newPass) {
        const [rows] = await db.query(`SELECT password FROM users WHERE email = ? LIMIT 1`, [this.email]);

        const result = await new Promise((resolve, reject) => {
            bcrypt.compare(this.password, rows[0].password, async (err, result) => {
                if (err) {
                    return reject(err);
                }
                bcrypt.hash(newPass, saltRounds, async (err, hash) => {
                    if (err) {
                        return reject(new Error('Error occurred during editing. Please try again.'));
                    }
                    try {
                        attributes = { password: hash };
                        const [result] = await db.query(`UPDATE users SET ? WHERE id = ?`, [attributes, this.id]);

                        if (result.affectedRows === 0) {
                            // console.log("qwe");
                            return reject(new Error(`Record with ID ${this.id} not found for update in table users`));
                        }

                        resolve(result); // Если всё успешно
                    } catch (error) {
                        return reject(new Error(error));
                    }
                });
                // resolve(result);
            });
        })
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
    async checkUser() {
        const [rows] = await db.query(`SELECT id, name, password FROM users WHERE email = ? LIMIT 1`, [this.email]);

        if (rows.length > 0) {
            const result = await new Promise((resolve, reject) => {
                bcrypt.compare(this.password, rows[0].password, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result);
                });
            });

            if (result) {
                return rows[0];
            } else {
                throw new Error("Incorrect password.");
            }
        } else {
            throw new Error("No user found with the given email.");
        }
    }

}

module.exports = User;
