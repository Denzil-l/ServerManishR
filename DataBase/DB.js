import knex from "knex";
import dotenv from 'dotenv'

dotenv.config()

const db = knex({
    client:'pg',
    connection:{
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    }
})

export default db

// IN this module I create a connection to the DATABASE