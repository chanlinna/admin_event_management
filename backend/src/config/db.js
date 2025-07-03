// Set up and export MySQL connection pool for database queries
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({path: "../.env"});

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

export default db;
