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
const paginate = require('mongoose-paginate')



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



// filter by category or brand
productRouter.get('/', (req, res) => {
    var filter = {};
    req.query.category ? filter.category = req.query.category : '';
    req.query.brand ? filter.brand = req.query.brand : '';
    req.query.name ? filter.name = req.query.name : '';
    req.query.q ? filter.searchString = { $regex: helper.getSearchString(req.query.q.trim()), $options: 'i' } : '';
    ProductModel.find(filter,(err, products) => {
        if (err) res.json({success: 0, message: "can not find"});
        else res.json({success: 1, message: products})
    })
    
})

productRouter.get('/paginate', async (req, res) => {
    const { perPage, page } = req.query;
    const options = {
        page : parseInt(page,10) || 1,
        limit : parseInt(perPage,10) || 8
    }
    ProductModel.paginate({}, options, (err, products) => {
        return res.json(products)
    });
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

productRouter.post('/addOrder', (req, res) => {
    // var orderInfo = req.body.payment;
    // console.log(req.body.payment)
    
    // console.log(req.body.payment.address)
    var orderInfo = {
        address : req.body.payment.payment.address,
        email : req.body.payment.payment.email,
        payerID : req.body.payment.payment.payerID,
        paymentID : req.body.payment.payment.paymentID,
        products : req.body.payment.item
    }
    console.log(orderInfo)
    OrderModel.create(orderInfo, (err, order) => {
        // console.log(order)
        if(err) res.json({success:0, message: "create fail"});
        else res.json({success: 1, message: order})
    })
    })



// best seller
productRouter.get('/bestSeller', (req, res) => {
    ProductModel.find({}).sort({ quantity: 'desc' }).exec((err, products) => {
        // CODE NGU
        // console.log(products[1].quantity)
        // var listBestSeller = [];
        // for ( let i = 0; i < 4; i++) {
        //     for (let k = products.length - 1; k > 0; k--) {
        //         // console.log(products[k]);
        //         for (let j = 0; j < listBestSeller.length; j++) {
        //             console.log(listBestSeller[j])
        //             if (products[k].quantity != 0 & producs[k] != listBestSeller[j]) {
        //                 listBestSeller.push(products[k]);
        //             }
        //         }
        //     }
        // }
        // res.json(listBestSeller);
        if (err) res.json({ success: 0, message: 'can not find products' })
        else {
            products = products.reverse();
            var listBestSeller = [];
            for (let i = 0; i < products.length; i++) {
                if (Number(products[i].quantity) != 0 && !listBestSeller.includes(products[i])) {
                    listBestSeller.push(products[i]);
                }
                if (listBestSeller.length == 4) {
                    break;
                }
            }
            res.json(listBestSeller);
        }
    })
})

// save review 
productRouter.post('/review', (req, res) => {
    var reviewData = {user : req.body.idUser, comment : req.body.comment, userName : req.body.username};
    ProductModel.findOneAndUpdate({_id : req.body.idProduct}, {$push: { review: reviewData }}, { new: true })
        .populate("review.user")
        .exec((err, product) => {
            if (err) res.json({ success: 0, message: "not found product" });
            else {
                res.json({ success: 1, message: product })
            }
        });
})




module.exports = productRouter;