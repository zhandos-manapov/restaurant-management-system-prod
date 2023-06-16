import { promisePool } from '../../connection'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError } from '../../errors'
import { ResultSetHeader } from 'mysql2'
import { IProduct } from './product.model'

const getProducts = async (req: Request, res: Response) => {
  const { category_id } = req.query
  if (category_id) {
    let query = 'select * from product where category_id=?'
    const [rows]: [any, any] = await promisePool.execute(query, [category_id])

    if (rows.length <= 0) throw new NotFoundError('Product does not exist')

    return res.status(StatusCodes.OK).json(rows)
  }
  let query = `
        select p.id, p.name, p.description, p.price, p.status, c.id as category_id, c.name as category_name 
        from product as p inner join category as c
        where p.category_id=c.id
        order by name`
  const [rows] = await promisePool.execute<IProduct[]>(query)
  res.status(StatusCodes.OK).json(rows)
}

const getProduct = async (req: Request, res: Response) => {
  const { product_id } = req.params
  let query = 'select * from product where id=?'
  const [rows] = await promisePool.execute<IProduct[]>(query, [product_id])

  if (rows.length <= 0) throw new NotFoundError('Product does not exist')

  res.status(StatusCodes.OK).json(rows[0])
}

const createProduct = async (req: Request, res: Response) => {
  const product: IProduct = req.body
  let query = 'insert into product (name, category_id, description, price, status) values(?,?,?,?,"true")'
  const [result]: [ResultSetHeader, any] = await promisePool.execute(query, [
    product.name,
    product.category_id,
    product.description,
    product.price,
  ])
  if (result.affectedRows <= 0) throw new BadRequestError('Product name already exists')

  res.status(StatusCodes.OK).json({ message: 'Product created successfully' })
}

const updateProduct = async (req: Request, res: Response) => {
  const product = req.body

  if (Object.keys(product).length === 0) return res.sendStatus(StatusCodes.OK)

  const { product_id } = req.params
  let query = 'select * from product where id=?'
  const [rows] = await promisePool.execute<IProduct[]>(query, [product_id])

  if (rows.length <= 0) throw new NotFoundError('Product does not exists')

  const [current_product] = rows
  const payload_product: { [key: string]: string } = {}

  payload_product.name = product.name ?? current_product.name
  payload_product.description = product.description ?? current_product.description
  payload_product.category_id = product.category_id ?? current_product.category_id
  payload_product.price = product.price ?? current_product.price
  payload_product.status = product.status ?? current_product.status

  query = 'update product set name=?, description=?, category_id=?, price=?, status=? where id=?'
  const [result]: [ResultSetHeader, any] = await promisePool.execute(query, [
    payload_product.name,
    payload_product.description,
    payload_product.category_id,
    payload_product.price,
    payload_product.status,
    product_id,
  ])
  if (result.affectedRows <= 0) throw new Error()

  res.status(StatusCodes.OK).json({ message: 'Product updated successfully' })
}

const deleteProduct = async (req: Request, res: Response) => {
  const { product_id } = req.params
  let query = 'delete from product where id=?'
  const [result]: [ResultSetHeader, any] = await promisePool.execute(query, [product_id])

  if (result.affectedRows <= 0) throw new NotFoundError('Product id was not found')

  res.status(StatusCodes.OK).json({ message: 'Product deleted successfully' })
}

export { getProducts, getProduct, createProduct, updateProduct, deleteProduct }
