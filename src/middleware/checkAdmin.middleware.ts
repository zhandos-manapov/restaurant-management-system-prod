import { NextFunction, Request, Response } from 'express'
import { UnauthorizedError } from '../errors'

export default function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (res.locals.user.role == 'admin') next()
  else throw new UnauthorizedError('You are not authorized to visit this route')
}
