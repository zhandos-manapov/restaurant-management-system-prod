import express from 'express'
import { createCategory, getCategories, updateCategory } from './category.controller'
import isAdmin from '../../middleware/checkAdmin.middleware'

const router = express.Router()

router.route('/').get(getCategories).post(isAdmin, createCategory)
router.route('/:category_id').patch(isAdmin, updateCategory)

export default router
