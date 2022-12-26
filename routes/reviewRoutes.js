const express = require('express');

const Router = express.Router();

const { authenticateUser, autorizedUser } = require('../middleware/authentication')

const {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview
} = require('../controller/reviewController');

Router
    .route('/')
    .post(authenticateUser, createReview)
    .get(getAllReviews);

Router
    .route('/:id')
    .get(getSingleReview)
    .patch(authenticateUser, updateReview)
    .delete(authenticateUser, deleteReview);

module.exports = Router