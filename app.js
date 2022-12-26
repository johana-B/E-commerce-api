require('dotenv').config();
require('express-async-errors');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const connectDB = require('./db/connect');

const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
// const productRouter = require('./routes/productRoutes');
// const reviewRouter = require('./routes/reviewRoutes');
// const orderRouter = require('./routes/orderRoute');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const app = express();

app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static('./public'));
app.use(fileUpload());

app.get('/', (req, res) => {
    console.log(req.signedCookies);
    res.send('e commerce api');
});
app.use('/auth', authRouter);
app.use('/users', userRouter);
// app.use('/products', productRouter);
// app.use('/reviews', reviewRouter);
// app.use('/orders', orderRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);



const port = process.env.port || 5000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(port, () => {
            console.log(`server is listening on port ${port}...`);
        })
    } catch (error) {
        console.log(error);
    }
};


start();