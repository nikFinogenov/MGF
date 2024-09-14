const db = require('../db');

const createUser = (login, password, fullName, email, callback) => {
  const query = 'INSERT INTO users (login, password, full_name, email) VALUES (?, ?, ?, ?)';
  db.query(query, [login, password, fullName, email], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
};

const findUserByLogin = (login, callback) => {
  const query = 'SELECT * FROM users WHERE login = ?';
  db.query(query, [login], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results[0]);
  });
};

const findUserByEmail = (email, callback) => {
  const query = 'SELECT * FROM users WHERE email = ? LIMIT 1';
  db.query(query, [email], (err, results) => {
      if (err) {
          return callback(err);
      }
      if (results.length > 0) {
          callback(null, results[0]);  
      } else {
          callback(null, null);
      }
  });
};

const findUserByLoginOrEmail = (login, email, callback) => {
  const query = 'SELECT * FROM users WHERE login = ? OR email = ?';
  db.query(query, [login, email], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
};

module.exports = { createUser, findUserByLogin, findUserByEmail, findUserByLoginOrEmail };
