import express from 'express'
import { createBill, deleteBill, getBills, getPdf, updateBill } from './bill.controller'

const router = express.Router()

router.route('/').get(getBills).post(createBill)
router.route('/:order_id').patch(updateBill).delete(deleteBill)
router.route('/pdf').post(getPdf)

export default router