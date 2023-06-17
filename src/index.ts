import 'express-async-errors'
import express, { Express, urlencoded, json, Request, Response } from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'

//Routes
import authRouter from './routes/auth/auth.route'
import errorHandler from './middleware/error-handler'
import authorize from './middleware/authorize.middleware'
import userRoute from './routes/user/user.route'
import categoryRoute from './routes/category/category.route'
import productRoute from './routes/product/product.route'
import billRoute from './routes/bill/bill.route'
import dashboardRoute from './routes/dashboard/dashboard.route'

dotenv.config()

const app: Express = express()

app.use(cors())
app.use(urlencoded({ extended: true }))
app.use(json())
app.use(morgan('short'))

app.get('/', (req: Request, res: Response) => res.send('Server working!'))
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', authorize, userRoute)
app.use('/api/v1/category', authorize, categoryRoute)
app.use('/api/v1/product', authorize, productRoute)
app.use('/api/v1/bill', authorize, billRoute)
app.use('/api/v1/dashboard', authorize, dashboardRoute)

app.use(errorHandler)

const port = process.env.PORT || 3000

import('./connection').then((promisePool) => {
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
    console.log(`worker pid ${process.pid}`)
  })
})
