import { Request, Response } from 'express'
import { promisePool } from '../../connection'
import { StatusCodes } from 'http-status-codes'
import { ResultSetHeader } from 'mysql2'
import { BadRequestError, NotFoundError } from '../../errors'
import { ICategory } from './category.model'

const getCategories = async (req: Request, res: Response) => {
  let query = 'select * from category order by name'
  const [rows, fields] = await promisePool.execute<ICategory[]>(query)
  res.status(StatusCodes.OK).json(rows)
}

const createCategory = async (req: Request, res: Response) => {
  const category = req.body
  let query = 'insert into category (name) values(?)'
  const [rows, fields]: [ResultSetHeader, any] = await promisePool.execute(query, [category.name])

  if (rows.affectedRows <= 0) throw new BadRequestError('Category already exists')

  res.status(StatusCodes.OK).json({ message: 'Category added successfully' })
}

const updateCategory = async (req: Request, res: Response) => {
  const category = req.body
  const { category_id } = req.params
  let query = 'update category set name=? where id=?'
  const [rows, fields]: [ResultSetHeader, any] = await promisePool.execute(query, [category.name, category_id])

  if (rows.affectedRows <= 0) throw new NotFoundError('Category does not exist')

  res.status(StatusCodes.OK).json({ message: 'Category updated successfully' })
}

export { getCategories, createCategory, updateCategory }
