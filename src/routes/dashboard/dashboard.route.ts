import expess from 'express'
import { getDashboardDetails } from './dashboard.controller'

const router = expess.Router()

router.route('/').get(getDashboardDetails)

export default router
