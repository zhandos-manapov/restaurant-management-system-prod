import { Response, Request } from 'express'
import { promisePool } from '../../connection'
import { IDashboardInfo } from './dashboardInfo.model'

const getDashboardDetails = async (req: Request, res: Response) => {
  let query = 'select count(id) as category_count from category'
  let [rows, fields]: [any, any] = await promisePool.execute(query)
  const { category_count } = rows[0]

  query = 'select count(id) as product_count from product'
  ;[rows, fields] = await promisePool.execute(query)
  const { product_count } = rows[0]

  query = 'select count(id) as bill_count from bill'
  ;[rows, fields] = await promisePool.query(query)
  const { bill_count } = rows[0]

  return res.status(200).json({ category_count, product_count, bill_count } as IDashboardInfo)
}

export { getDashboardDetails }
