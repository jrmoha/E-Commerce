import mysql2 from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();
const connection = await mysql2.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DB,
    multipleStatements: true,
}).promise();

export default connection;