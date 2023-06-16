import { RowDataPacket } from 'mysql2'

export interface IDashboardInfo extends RowDataPacket {
  category_count: number
  product_count: number
  bill_count: number
}
