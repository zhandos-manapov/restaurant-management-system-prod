import { RowDataPacket } from 'mysql2'

interface IBillItem {
  id: number
  name: string
  price: number
  total: number
  category: string
  quantity: number
}

export interface IBill extends RowDataPacket {
  id: number
  uuid: string
  name: string
  email: string
  contact_number: string
  payment_method: string
  total: number
  product_details: IBillItem[]
  created_by: string
}
