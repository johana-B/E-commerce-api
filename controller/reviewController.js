const Review = require('../model/review');
const Product = require('../model/product');

const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const { checkPermissions } = require('../utils');

const createReview = async (req, res) => {
    const { product: productId } = req.body;
    const isValidProduct = await Product.findOne({ _id: productId });
    if (!isValidProduct) {
        throw new CustomError.NotFoundError(`no product with id${productId}`);
    }
    const isSubmmitedReview = await Review.findOne({
        product: productId,
        user: req.user.userId
    })
    if (isSubmmitedReview) {
        throw new CustomError.BadRequestError('Already submmited review for this product');
    }
    req.body.user = req.user.userId;
    const review = await Review.create(req.body);
    res.status(StatusCodes.CREATED).json({ review });

};

const getAllReviews = async (req, res) => {
    const review = await Review.find({}).populate({
        path: 'product',
        select: 'name company price'
    }).populate({
        path: 'user', select: 'firstName email'
    });
    res.status(StatusCodes.OK).json({ review, count: review.length });
};

const getSingleReview = async (req, res) => {
    const { id: reviewId } = req.params
    const review = await Review.findOne({ _id: reviewId })
        .populate({
            path: 'product',
            select: 'name company price'
        })
        .populate({
            path: 'user', select: 'firstName email'
        });
    if (!review) {
        throw new CustomError.NotFoundError(`no review with id ${reviewId}`);
    };
    res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
    const { id: reviewId } = req.params;
    const { rating, title, comment } = req.body;
    const review = await Review.findOne({ _id: reviewId });
    if (!review) {
        throw new CustomError.NotFoundError(`no review with id ${reviewId}`);
    };
    checkPermissions(req.user, review.user);
    review.rating = rating,
        review.title = title,
        review.comment = comment,

        await review.save()
    res.status(StatusCodes.OK).json({ review, msg: 'review updated successfully' });
};

const deleteReview = async (req, res) => {
    const { id: reviewId } = req.params;
    const review = await Review.findOne({ _id: reviewId });
    if (!review) {
        throw new CustomError.NotFoundError(`no review with id ${reviewId}`);
    }
    checkPermissions(req.user, review.user);
    await review.remove();
    res.status(StatusCodes.OK).json({ msg: 'review removed successfully' });
}

const getSingleProductReviews = async (req, res) => {
    const { id: productId } = req.params;
    const reviews = await Review.findOne({ product: productId });
    res.status(StatusCodes.OK).json({ reviews });
}

module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
    getSingleProductReviews
}