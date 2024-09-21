const db = require('../db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class User {
    constructor(name, email, password) {
        this.name = name || '';
        this.email = email || '';
        this.password = password || '';
        this.avatar = '123.png';
        this.id = -1;
    }
    clear() {
        this.name = '';
        this.password = '';
        this.email = '';
        this.id = -1;
    }


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
            bcrypt.hash(this.password, saltRounds, async (err, hash) => {
                if (err) {
                    return reject(new Error('Error occurred during registration. Please try again.'));
                }

                let attributes = { name: this.name, email: this.email, password: hash, avatar: this.avatar };

                if (this.id !== -1) {
                    try {
                        if (this.password === '')
                            attributes = { name: this.name, email: this.email, avatar: this.avatar };
                        const [result] = await db.query(`UPDATE users SET ? WHERE id = ?`, [attributes, this.id]);

                        if (result.affectedRows === 0) {
                            return reject(new Error(`Record with ID ${this.id} not found for update in table users`));
                        }

                        resolve(result);
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
        try {
            const [rows] = await db.query(`SELECT password FROM users WHERE email = ? LIMIT 1`, [this.email]);
    
            if (!rows.length) {
                throw new Error('User not found');
            }
    
            const passwordMatch = await bcrypt.compare(this.password, rows[0].password);
            if (!passwordMatch) {
                throw new Error('Password mismatch');
            }
    
            const hash = await bcrypt.hash(newPass, saltRounds);
    
            const attributes = { password: hash };
            const [result] = await db.query(`UPDATE users SET ? WHERE id = ?`, [attributes, this.id]);
    
            if (result.affectedRows === 0) {
                throw new Error(`Record with ID ${this.id} not found for update in table users`);
            }
    
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async checkUser() {
    const [rows] = await db.query(`SELECT id, name, password, avatar FROM users WHERE email = ? LIMIT 1`, [this.email]);

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
            throw new Error("Does not match");
        }
    } else {
        throw new Error("Does not match");
    }
}

}

module.exports = User;
