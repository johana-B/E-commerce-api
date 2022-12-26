const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
    {
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: [true, 'please provide rating']
        },
        title: {
            type: String,
            trim: true,
            max: 100,
            required: [true, 'please provide title']
        },
        comment: {
            type: String,
            required: [true, 'please provide text']
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        product: {
            type: mongoose.Types.ObjectId,
            ref: 'product',
            required: true,
        },
    }, { timeseries: true }
);

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.statics.avgRating = async function (productId) {
    const result = await this.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                numOfReviews: { $sum: 1 },
            },
        },
    ]);
    console.log(result);
    try {
        await this.model('product').findOneAndUpdate({ _id: productId }, {
            averageRating: Math.ceil(result[0]?.averageRating || 0),
            numOfReviews: result[0]?.numOfReviews || 0,
        });
    } catch (error) {
        console.log(error);
    }
};
ReviewSchema.post('save', async function () {
    await this.constructor.avgRating(this.product);
});

ReviewSchema.post('remove', async function () {
    await this.constructor.avgRating(this.product);
});
const reviewSchema = mongoose.model('review', ReviewSchema);
module.exports = reviewSchema;