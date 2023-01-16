const express = require('express')

const Router = express.Router();

const { authenticateUser, autorizedUser } = require('../middleware/authentication')

const {
    createOrder,
    getAllOrders,
    getCurrentUserOrders,
    getSingleOrder,
    updateOrder
} = require('../controller/orderController');

Router
    .route('/')
    .get([authenticateUser, autorizedUser('admin')], getAllOrders)
    .post(authenticateUser, createOrder)
Router
    .route('/showAllMyOrders')
    .get(authenticateUser, getCurrentUserOrders)

Router
    .route('/:id')
    .get(authenticateUser, getSingleOrder)
    .patch(authenticateUser, updateOrder)



module.exports = Router;