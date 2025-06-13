
const mysql = require('mysql2');
const config = require('./config.json');
const fs = require('fs');
require('dotenv').config();
const pool = mysql.createPool({
  host: process.env.DB_HOST || config.host,
  port: process.env.DB_PORT || config.port,
  user: process.env.DB_USER || config.user,
  password: process.env.DB_PASS || config.password,
  database: process.env.DB_NAME || config.database,
  ssl: {
    ca: fs.readFileSync(process.env.DB_CA || './ca-cert.pem')  // adjust path if needed
  }
});

console.log(pool);

module.exports = pool.promise();
