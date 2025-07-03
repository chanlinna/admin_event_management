import mysql from "mysql2/promise";
import dotenv from "dotenv";
 
dotenv.config({path: "../.env"});
 
// TODO
// Create the pool to connect to the database
// Use the database settings from the .env file
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true, // If true, the pool will queue connections if no free connection is available
    connectionLimit: 10,      // Max number of connections in the pool
    queueLimit: 0             // Limit for the number of queued requests (0 means no limit)
});

// Optional: Log a message to confirm pool creation or handle initial connection test
pool.getConnection()
    .then(connection => {
        console.log('Database connection pool created and connected successfully!');
        connection.release(); // Release the connection back to the pool
    })
    .catch(err => {
        console.error('Error connecting to the database pool:', err.message);
        // It's often critical for the app to connect to the DB, so you might exit here
        process.exit(1);
    });

export { pool };
// Set up and export MySQL connection pool for database queries