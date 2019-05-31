const express = require('express');
const Router = express.Router;
const apiRouter = Router();
const jwt = require('jsonwebtoken');

const authRouter = require('../routers/authRouter');
const userRouter = require('../routers/userRouter');
const productRouter = require('../routers/productRouter');

apiRouter.use('/user', userRouter);

apiRouter.use('/auth',authRouter);

//authorization

apiRouter.use((req,res,next) => {
    const token = req.body.token || req.get('x-auth-token') || req.query.token;
    if(token) {
        const user = jwt.verify(token,"aaaa")
        if(user){
            req.user = user
            next();
        }
        else {
            res.status(401).send({success: 0,message:"ban chua dang nhap"})
        }
    }
    else {
        res.status(401).send({success: 0,message:"ban chua dang nhap"})
    }
})

apiRouter.use('/products', productRouter);

module.exports = apiRouter;