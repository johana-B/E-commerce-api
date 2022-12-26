const express = require('express')

const Router = express.Router();

const { authenticateUser, autorizedUser } = require('../middleware/authentication')

const {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
} = require('../controller/productController')

const { getSingleProductReviews } = require('../controller/reviewController');

Router
    .route('/')
    .post([authenticateUser, autorizedUser('admin')], createProduct)
    .get(getAllProducts);

Router.route('/uploadImage')
    .post([authenticateUser, autorizedUser('admin')], uploadImage);

Router
    .route('/:id')
    .get(getSingleProduct)
    .patch([authenticateUser, autorizedUser('admin')], updateProduct)
    .delete([authenticateUser, autorizedUser('admin')], deleteProduct);

Router
    .route('/:id/reviews').get(getSingleProductReviews)
module.exports = Router
