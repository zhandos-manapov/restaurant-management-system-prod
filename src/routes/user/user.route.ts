import express from 'express'
import isAdmin from '../../middleware/checkAdmin.middleware'
import { changePassword, getUsers, updateUser } from './user.controller'

const router = express.Router()

router.route('/').get(isAdmin, getUsers)
router.route('/:user_id').patch(isAdmin, updateUser)
router.route('/password').post(changePassword)

export default router
