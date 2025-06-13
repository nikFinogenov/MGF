
const mysql = require('mysql2');
const config = require('./config.json');
const fs = require('fs');
require('dotenv').config();
const pool = mysql.createPool({
  host: process.env.HOST || config.host,
  port: process.env.PORT || config.port,
  user: process.env.DB_USER || config.user,
  password: process.env.PASS || config.password,
  database: process.env.DB_NAME || config.database,
  ssl: {
    ca: fs.readFileSync(process.env.DB_CA || './certs/ca-cert.pem')  // adjust path if needed
  }
});

console.log(pool);

module.exports = pool.promise();
