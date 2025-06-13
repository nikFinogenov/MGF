
const mysql = require('mysql2');
const config = require('./config.json');

const pool = mysql.createPool({
  host: process.env.HOST || config.host,
  port: process.env.PORT || config.port,
  user: process.env.USER || config.user,
  password: process.env.PASS || config.password,
  database: process.env.DB_NAME || config.database
});

module.exports = pool.promise();
