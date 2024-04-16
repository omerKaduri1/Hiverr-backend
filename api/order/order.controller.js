import { logger } from "../../services/logger.service.js"
import { socketService } from "../../services/socket.service.js"
import { orderService } from "./order.service.js"

export async function getBuyerOrdersById(req, res) {
    try {
        let buyerOrders
        buyerOrders = await orderService.buyerQuery()
        res.json(buyerOrders)
    } catch (err) {
        logger.error("Failed to get orders", err)
        res.status(500).send({ err: "Failed to get orders" })
    }
}

export async function getSellerOrdersById(req, res) {
    try {
        let orders
        orders = await orderService.sellerQuery()
        res.json(orders)
    } catch (err) {
        logger.error("Failed to get orders", err)
        res.status(500).send({ err: "Failed to get orders" })
    }
}

export async function addOrder(req, res) {
    // const { loggedinUser } = req
    // console.log('loggedinuser from controller',loggedinUser);
    try {
        const order = req.body
        // order.buyerBack = loggedinUser
        const addedOrder = await orderService.add(order)
        socketService.emitToUser({
            type: 'new-client-order',
            data: { username: order.buyer.fullname },
            userId: order.seller._id
        })
        res.json(addedOrder)
    } catch (err) {
        logger.error("order.controller: Failed to add orders", err)
        res.status(500).send({ err: "Failed to add orders" })
    }
}

export async function updateStatus(req, res) {
    try {
        const orderId = req.params.id
        const { status } = req.body
        const updatedOrder = await orderService.updateStatus(orderId, status)
        socketService.emitToUser({
            type: 'order-status-updated',
            data: {
                sellerName: updatedOrder.seller.fullname,
                status: updatedOrder.status
            },
            userId: updatedOrder.buyer._id
        })
        res.json(updatedOrder)
    } catch (err) {
        logger.error("Failed to update order status", err)
        res.status(500).send({ err: "Failed to update order status" })
    }
}