import 'express-async-errors'
import express, { Express, urlencoded, json } from 'express'
import * as dotenv from 'dotenv'
import mysql from 'mysql2'
import cors from 'cors'

//Routes
import authRouter from './routes/auth.route'
import errorHandler from './middleware/error-handler'
import authorize from './middleware/authorize.middleware'
import userRoute from './routes/user.route'
import categoryRoute from './routes/category.route'
import productRoute from './routes/product.route'
import billRoute from './routes/bill.route'
import dashboardRoute from './routes/dashboard.route'

dotenv.config()

const app: Express = express()

app.use(cors())
app.use(urlencoded({ extended: true }))
app.use(json())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', authorize, userRoute)
app.use('/api/v1/category', authorize, categoryRoute)
app.use('/api/v1/product', authorize, productRoute)
app.use('/api/v1/bill', authorize, billRoute)
app.use('/api/v1/dashboard', authorize, dashboardRoute)

app.use(errorHandler)

const pool = mysql.createPool({
    port: +process.env.DB_PORT!,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

pool.on('connection', (connection: any) => {
    console.log('DB Connection established');

    connection.on('error', (err: any) => {
        console.error(new Date(), 'MySQL error', err.code);
    })

    connection.on('close', (err: any) => {
        console.error(new Date(), 'MySQL close', err);
    })

})


const port = process.env.PORT || 3000

app.listen(port, () => console.log(`⚡️[server]: Server is running at http://localhost:${port}`))

export default pool.promise()
