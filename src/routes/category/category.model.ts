import { RowDataPacket } from 'mysql2'

export interface ICategory extends RowDataPacket {
  id: number
  name: string
}
