import { Request, Response } from "express";
import promisePool from '../index'
import { StatusCodes } from "http-status-codes";
import { ResultSetHeader } from "mysql2";
import { BadRequestError, NotFoundError } from "../errors";
import { genHash, validPassword } from "../utils/auth.utils";

const getUsers = async (req: Request, res: Response) => {
    let query = 'select id, name, email, contact_number, status, role from user where role="user"'
    const [rows, fields] = await promisePool.execute(query)
    res.status(StatusCodes.OK).json(rows)
}

const updateUser = async (req: Request, res: Response) => {
    const user = req.body
    const { user_id } = req.params
    let query = 'update user set status=? where id=?'
    const [rows, fields]: [ResultSetHeader, any] = await promisePool.execute(query, [user.status, user_id])
    if (rows.affectedRows > 0) res.status(StatusCodes.OK).json({ message: 'User updated successfully' })
    else throw new NotFoundError('User id does not exists')
}

const changePassword = async (req: Request, res: Response) => {
    const user = req.body
    const email = res.locals.user.sub

    let query = 'select * from user where email=?'
    const [rows, fields]: [any, any] = await promisePool.execute(query, [email])
    console.log(rows, fields)
    const [db_user] = rows

    if (rows.length <= 0) throw new NotFoundError('User email does not exists')

    const verify = validPassword(user.old_password, db_user.hash, db_user.salt)

    if (!verify) throw new BadRequestError('Invalid credentials')

    const { salt, hash } = genHash(user.new_password)
    query = 'update user set salt=?, hash=? where email=?'
    const [result]: [ResultSetHeader, any] = await promisePool.execute(query, [salt, hash, email])

    if (rows.affectedRows <= 0) throw new Error()

    res.status(StatusCodes.OK).json({ message: 'User credentials were successfully updated' })
}

export {
    getUsers,
    updateUser,
    changePassword
}