import { promisePool } from '../../connection'
import { v4 as uuidv4 } from 'uuid'
import ejs from 'ejs'
import html_to_pdf from 'html-pdf-node'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResultSetHeader } from 'mysql2'
import { BadRequestError, NotFoundError } from '../../errors'
import { IBill } from './bill.model'

const getBills = async (req: Request, res: Response) => {
  let query = 'select * from bill order by id desc'
  const [rows] = await promisePool.execute<IBill[]>(query)
  res.status(StatusCodes.OK).json(rows)
}

const createBill = async (req: Request, res: Response) => {
  const gen_uuid = uuidv4()
  const order_details: IBill = req.body
  let query = `
        insert into bill(name, uuid, email, contact_number, payment_method, total, product_details, created_by)
        values(?,?,?,?,?,?,?,?)`
  const [result]: [ResultSetHeader, any] = await promisePool.execute(query, [
    order_details.name,
    gen_uuid,
    order_details.email,
    order_details.contact_number,
    order_details.payment_method,
    order_details.total,
    order_details.product_details,
    res.locals.user.sub,
  ])
  if (result.affectedRows <= 0) throw new BadRequestError('Bill with the same name or email already exists')

  res.status(StatusCodes.OK).json({ message: 'Bill added successfully' })
}

const updateBill = async (req: Request, res: Response) => {
  const order_details: IBill = req.body
  const { order_id } = req.params
  let query =
    'update bill set name=?, email=?, contact_number=?, payment_method=?, total=?, product_details=? where id=?'
  const [result]: [ResultSetHeader, any] = await promisePool.execute(query, [
    order_details.name,
    order_details.email,
    order_details.contact_number,
    order_details.payment_method,
    order_details.total,
    order_details.product_details,
    order_id,
  ])
  if (result.affectedRows <= 0) throw new NotFoundError('Bill id not found')

  res.status(StatusCodes.OK).json({ message: 'Bill updated successfully' })
}

const getPdf = async (req: Request, res: Response) => {
  const order_details = req.body
  ejs.renderFile(`${__dirname}/../report.ejs`, { ...order_details }, (err, str: string) => {
    if (err) throw err
    html_to_pdf.generatePdf(
      { content: str },
      { format: 'A5', path: `./../../generated_pdf/${order_details.uuid}.pdf` },
      (err, buffer) => {
        if (err) throw err
        res.status(StatusCodes.OK).send(buffer)
      }
    )
  })
}

const deleteBill = async (req: Request, res: Response) => {
  const { order_id } = req.params
  let query = 'delete from bill where id=?'
  const [result]: [ResultSetHeader, any] = await promisePool.execute(query, [order_id])

  if (result.affectedRows <= 0) throw new NotFoundError('Bill id was not found')

  res.status(StatusCodes.OK).json({ message: 'Bill deleted successfully' })
}

export { getBills, createBill, updateBill, getPdf, deleteBill }
