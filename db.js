
const mysql = require('mysql2');
const config = require('./config.json');
require('dotenv').config();
const pool = mysql.createPool({
  host: process.env.HOST || config.host,
  port: process.env.PORT || config.port,
  user: process.env.DB_USER || config.user,
  password: process.env.PASS || config.password,
  database: process.env.DB_NAME || config.database
});

console.log(pool);

module.exports = pool.promise();
