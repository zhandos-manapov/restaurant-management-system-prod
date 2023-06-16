import mysql from 'mysql2'
import * as dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
  port: +process.env.DB_PORT!,
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

pool.on('connection', (connection: any) => {
  console.log('DB Connection established')

  connection.on('error', (err: any) => {
    console.error(new Date(), 'MySQL error', err.code)
  })

  connection.on('close', (err: any) => {
    console.error(new Date(), 'MySQL close', err)
  })
})

export const promisePool = pool.promise()
