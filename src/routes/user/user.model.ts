import { RowDataPacket } from 'mysql2'

export interface IUser extends RowDataPacket {
  id: number
  name: string
  contact_number: string
  email: string
  salt: string
  hash: string
  status: boolean
  role: string
}
