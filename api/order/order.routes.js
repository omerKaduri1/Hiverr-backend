import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { getBuyerOrdersById, addOrder, updateStatus, getSellerOrdersById } from './order.controller.js'

const router = express.Router()

router.get('/buyer', getBuyerOrdersById)
router.get('/seller', getSellerOrdersById)
router.post('/', addOrder)
router.put('/:id', updateStatus)

export const orderRoutes = router