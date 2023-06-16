import { promisePool } from '../../connection'
import { Request, Response } from 'express'
import { ResultSetHeader } from 'mysql2'
import { genHash, issueJWT, validPassword } from '../../utils/auth.utils'
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../errors'
import { StatusCodes } from 'http-status-codes'
import { IUser } from '../user/user.model'

const signup = async (req: Request, res: Response) => {
  const user = req.body
  let query = 'select email from user where email=?'

  const [rows] = await promisePool.execute<IUser[]>(query, [user.email])

  if (rows.length > 0) throw new BadRequestError('Email already exists')

  const { salt, hash } = genHash(req.body.password)
  const payload_user = {
    name: user.name,
    email: user.email,
    contact_number: user.contact_number,
    status: false,
    role: 'user',
    salt: salt,
    hash: hash,
  }

  query = 'insert into user(name, email, contact_number, status, role, salt, hash) values(?,?,?,?,?,?,?)'
  const [result]: [ResultSetHeader, any] = await promisePool.execute(query, [
    payload_user.name,
    payload_user.email,
    payload_user.contact_number,
    payload_user.status,
    payload_user.role,
    payload_user.salt,
    payload_user.hash,
  ])
  if (result.affectedRows <= 0) throw new Error()

  return res.status(200).json({ message: 'Successfully registed' })
}

const signin = async (req: Request, res: Response) => {
  const user = req.body
  let query = 'select email, name, role, status, salt, hash, status from user where email=?'

  const [rows] = await promisePool.execute<IUser[]>(query, [user.email])
  const [db_user] = rows

  if (rows.length <= 0) throw new NotFoundError('User email does not exist')

  if (db_user.status == false) throw new Error('Wait for admin approval')

  const verify = validPassword(user.password, db_user.hash, db_user.salt)

  if (!verify) throw new UnauthorizedError('Invalid credentials')

  const token = issueJWT({ ...db_user })
  return res.status(StatusCodes.OK).json(token)
}

export { signin, signup }
