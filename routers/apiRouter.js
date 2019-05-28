const express = require('express');
const Router = express.Router;
const apiRouter = Router();

const authRouter = require('../routers/authRouter');
const userRouter = require('../routers/userRouter');
const productRouter = require('../routers/productRouter');

apiRouter.use('/user', userRouter);

apiRouter.use('/auth',authRouter);

//authorization

apiRouter.use((req,res,next) => {
    if(req.session.userInfo) {
        next();
    }
    else {
        res.status(401).send({success: 0,message:"ban chua dang nhap"})
    }
})

apiRouter.use('/products', productRouter);

module.exports = apiRouter;