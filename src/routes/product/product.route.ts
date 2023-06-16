import express from 'express'
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from './product.controller'
import isAdmin from '../../middleware/checkAdmin.middleware'
import { isatty } from 'tty'

const router = express.Router()

router.route('/').get(getProducts).post(isAdmin, createProduct)
router.route('/:product_id').get(isAdmin, getProduct).patch(isAdmin, updateProduct).delete(isAdmin, deleteProduct)

export default router