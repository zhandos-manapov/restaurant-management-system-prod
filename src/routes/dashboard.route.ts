import expess from 'express'
import { getDashboardDetails } from '../controllers/dashboard.controller'

const router = expess.Router()

router.route('/').get(getDashboardDetails)

export default router