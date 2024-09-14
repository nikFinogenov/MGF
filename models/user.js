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
                        const [result] = await db.query(`UPDATE users SET ? WHERE id = ?`, [attributes, this.id]);
    
                        if (result.affectedRows === 0) {
                            console.log("qwe");
                            return reject(new Error(`Record with ID ${this.id} not found for update in table users`));
                        }
    
                        resolve(result); // Если всё успешно
                    } catch (error) {
                        reject(new Error(`Error updating record: ${error.message}`));
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
        const [rows] = await db.query(`SELECT password FROM users WHERE email = ? LIMIT 1`, [this.email]);
        if (rows.length > 0) {
            bcrypt.compare(this.password, rows[0].password, (err, result) => {
                if (result) {
                    return true;
                //   req.session.userId = user.id;
                //   req.session.status = user.status;
                //   res.redirect('/dashboard');
                } else {
                    throw new Error("Does not match.");
                //   res.send('Incorrect password.');
                }
              });
            // this.attributes = rows[0];
            // this.name = this.attributes.name;
            // this.email = this.attributes.email;
            // this.status = this.attributes.status;
            // this.id = this.attributes.id;
        } else {
            throw new Error(`Does not match`);
        }
    }
}

module.exports = User;
