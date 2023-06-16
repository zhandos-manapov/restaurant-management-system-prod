import { RowDataPacket } from 'mysql2'

export interface IProduct extends RowDataPacket {
  id: number
  name: string
  description: string
  price: number
  status: boolean
  category_id: number
  category_name?: string
}
