const express = require('express');
const Router = express.Router;
const apiRouter = Router();

const authRouter = require('../routers/authRouter');
const userRouter = require('../routers/userRouter');
const productRouter = require('../routers/productRouter');
const jwt = require('jsonwebtoken');
apiRouter.use('/user', userRouter);

apiRouter.use('/auth',authRouter);

//authorization


apiRouter.use('/products', productRouter);

module.exports = apiRouter;