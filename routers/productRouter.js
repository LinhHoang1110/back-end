const express = require('express');
const Router = express.Router;
productRouter = Router();

// model 
const UserModel = require('../models/users');
const ProductModel = require('../models/product');
const ProductInfoModel = require('../models/productInfo');
const OrderModel = require('../models/order');
const helper = require('../utils/index');
const auth = require('./auth')

// feature
//1. create fake db productModel
productRouter.get('/addProduct', (req, res) => {
    

    var category = ['vape', 'tinhDau', 'pods', 'tankVape', 'phuKien'];
    var brand = ['joyetech', 'eleaf', 'widmec', 'smoant', 'wismec'];
    for (i = 0; i < 10; i++) {
        const data = {
            name: Math.random().toString(36).substring(2, 15),
            imgUrl: Math.random().toString(36).substring(2, 15),
            description: Math.random().toString(36).substring(2, 15),
            review: Math.random().toString(36).substring(2, 15),
            quantity: Math.floor(Math.random() * Math.floor(10)),
            id: Math.random().toString(36).substring(7),
            price: Math.floor(Math.random() * 900 + 100),
            brand: brand[Math.floor(Math.random() * brand.length)],
            category: category[Math.floor(Math.random() * category.length)],
        }
        data.searchString = helper.getUnicodeText(`${data.name} ${data.brand} ${data.category}`)
        ProductModel.create(data)
    }
    res.send("sucess!!")
})


// find all product 

productRouter.get('/searchProductById', (req, res) => {
    var id = req.query.id;
    ProductModel.findOne({ id: id }, (err, productFounded) => {
        if (err) res.json({ success: 0, message: 'not found' });
        else {
            res.json(productFounded);
        }
    })
})

// all product 
productRouter.get('/showAll', (req, res) => {
    ProductModel.find({}, (err,allProduct) => {
        if(err) res.json({success: 0, message: 'can not find'});
        else res.json(allProduct);
    })
})


// filter by category or brand
productRouter.get('/', (req, res) => {
    var filter = {}; 
    req.query.category ? filter.category = req.query.category : '';
    req.query.brand ? filter.brand = req.query.brand : '';
    req.query.name ? filter.name = req.query.name : '';
    req.query.q ? filter.searchString = { $regex: helper.getSearchString(req.query.q.trim()), $options: 'i' } : "";
    ProductModel.find(filter, (err, products) => {
        if (err) res.json({ sucess: 0, message: 'not found' });
        else res.json(products)
    })
})


// show detail product 

productRouter.get('/detail/:id', (req, res) => {
    var id = req.params.id;
    ProductModel.findOne({ id: id }, (err, product) => {
        if (err) res.json({ success: 0, message: 'not found' });
        else {
            res.json(product)
        }
    })
})


//show_order 

productRouter.post('/addOrder',auth, (req, res) => {
    var orderInfo = req.body;
    OrderModel.create(orderInfo,(err,order) => {
        if(err) res.json({success:0,message:"can not create"});
        else res.json({success: 1,message: "create success"})
    })
})


// best seller
productRouter.get('/bestSeller', (req, res) => {
    ProductInfoModel.find({}).sort({quantity: 'desc'}).exec((err, products) => {
        var listBestSeller = [];
        for(i = 0; i < 2; i++) {
            listBestSeller.push(products[i]);  
        }
        res.json(listBestSeller);
    })
})

// save review 
productRouter.post('/review', auth, (req, res) => {
    var reviewData = {user : req.body.idUser, comment : req.body.comment, userName : req.body.username};

    // ProductModel.findOne({_id : req.body.idProduct}, (err, product) => {
    //     if(err) res.json({success: 0, message: "not found product"});
    //     else {
    //         console.log(product);
    //         product.review.push(reviewData);
    //         product.save();
    //         res.json({success: 1, message:product})
    //     }
    // });

    ProductModel.findOneAndUpdate({_id : req.body.idProduct}, {$push: { review: reviewData }}, { new: true })
        .populate("review.user")
        .exec((err, product) => {
            if(err) res.json({success: 0, message: "not found product"});
            else {
                res.json({success: 1, message:product}) 
            }
    });
})


module.exports = productRouter;