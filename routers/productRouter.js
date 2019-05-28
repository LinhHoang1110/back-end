const express = require('express');
const Router = express.Router;
productRouter = Router();

// model 
const UserModel = require('../models/users');
const ProductModel = require('../models/product');
const ProductInfoModel = require('../models/productInfo');
const OrderModel = require('../models/order');

// feature
//1. create fake db productModel
productRouter.get('/addProduct', (req, res) => {
    
    var category = ['vape', 'tinhDau', 'pods', 'tankVape', 'phuKien'];
    var brand = ['joyetech', 'eleaf', 'widmec', 'smoant', 'wismec'];
    for (i = 0; i < 10; i++) {
        ProductModel,ProductInfoModel.create({
            name: Math.random().toString(36).substring(2, 15),
            imgUrl: Math.random().toString(36).substring(2, 15),
            description: Math.random().toString(36).substring(2, 15),
            review: Math.random().toString(36).substring(2, 15),
            quantity: Math.floor(Math.random() * Math.floor(10)),
            id: Math.random().toString(36).substring(7),
            price: Math.floor(Math.random() * 900 + 100),
            brand: brand[Math.floor(Math.random() * brand.length)],
            category: category[Math.floor(Math.random() * category.length)]
        })
    }
    res.send("sucess!!")
})


// find all product 

productRouter.get('/all_product', (req, res) => {
    ProductInfoModel.find({}, (err, allProduct) => {
        if(err) res.json({success: 0, message: 'not found'});
        else res.json({success: 1, message: allProduct})
    })
})
//2. find product by id
productRouter.get('/:id', (req, res) => {
    var idProduct = req.params.id;
    ProductModel.findOne({ id: idProduct }, (err, product) => {
        if (err) res.json({ success: 0, message: 'not found' })
        else res.json(product);
    })
})

//3. find by category
productRouter.get('/:category', (req, res) => {
    var category = req.params.category;
    ProductModel.find({ category: category }, (err, products) => {
        if (err) res.json({ sucess: 0, message: 'not found' });
        else res.json(products)
    })
})

//4. find by brand

productRouter.get('/:brand', (req, res) => {
    var brand = req.params.brand;
    ProductModel.find({ brand: brand }, (err, products) => {
        if (err) res.json({ success: 0, message: 'not found' });
        else res.json(products)
    })
})

//5. show detail product 

productRouter.get('/detail/:id',(req, res) => {
    var id = req.params.id;
    ProductModel.findOne({_id : id}, (err, product) => {
        if(err) res.json({success: 0, message: 'not found'});
        else {
            res.json(product)
        }
    })
})

//6.add to cart
productRouter.get('/detail/:id/:quantity', (req, res) => {
    var idProduct = req.params.id;
    var quantity = req.params.quantity;
    ProductModel.findOne({_id : idProduct}, (err, productFound) => {
        if (err) res.json({ success: 0, message: 'Product not found!' })
        else {
            var price = productFound.price;
            OrderModel.findOne({ 'user': req.session.userInfo._id, 'status': '0' }, (err1, orderFound) => {
                if (err1) res.json({ success: 0, message: 'Order not found!' })
                else {
                    // khi không có giỏ hàng => tạo 
                    if (orderFound == null) {
                        var productInfoData = {
                            product: productFound, 
                            quantity: quantity,
                            status: '0',
                            user: req.session.userInfo._id
                        };
                        ProductInfoModel.create(productInfoData, (err2, productInfoCreated) => {
                            if(err2) res.json({success: 0, message: 'Creating ProductInfo Fail!'});
                            else {
                                var orderData = {
                                    user: req.session.userInfo._id,
                                    productInfo: productInfoCreated._id,
                                    cost: price * quantity,
                                    address: '',
                                    status: '0'
                                }
                                OrderModel.create(orderData, (err3, orderCreated) => {
                                    if (err3) res.json({ success: 0, message: 'Creating Order Fail!' })
                                    else {
                                        res.json(orderCreated);
                                    }
                                });
                            }
                        })
                    } 
                    else { // khi đã tồn tại giỏ hàng thì chỉ thêm đồ vào 
                        ProductInfoModel.findOne({ 'product': productFound, 'user': req.session.userInfo._id, 'status': '0' }, (err2, productInfoFound) => {
                            if (err2) res.json({ success: 0, message: 'ProductInfo not found!' })
                            else {
                                if (productInfoFound == null) {
                                    // đồ chưa có trong giỏ hàng, tạo mới productInfo, add vào order và update order lên db 
                                    var productInfoData = {
                                        product: productFound, 
                                        quantity: quantity,
                                        status: '0',
                                        user: req.session.userInfo._id
                                    };
                                    ProductInfoModel.create(productInfoData, (err3, productInfoCreated) => {
                                        if(err3) res.json({success: 0, message: 'Creating ProductInfo Fail!'});
                                        else {
                                            var listInfoData = orderFound.productInfo;
                                            listInfoData.push(productInfoCreated._id);
                                            orderFound.productInfo = listInfoData;
                                            OrderModel.findByIdAndUpdate(orderFound._id, { $set: orderFound }, (err4, OrderUpdated) => {
                                                if (err4) res.json({ success: 0, message: 'Order updated fail!' });
                                                else res.json({ OrderUpdated })
                                            })
                                        }
                                    });
                                } else {
                                    // đồ đã có trong giỏ hàng, chỉ update số lượng trong productInfo 
                                    var productInfoData = {
                                        product: productFound, 
                                        quantity: `${ Number(productInfoFound.quantity) + Number(quantity) }`,
                                        status: '0',
                                        user: req.session.userInfo._id
                                    };
                                    ProductInfoModel.findByIdAndUpdate(productInfoFound._id, { $set: productInfoData }, (err3, ProductInfoUpdated) => {
                                        if (err3) res.json({ success: 0, message: 'ProductInfo updated fail' });
                                        else res.json({ ProductInfoUpdated })
                                    })
                                }
                            }
                        });
                    }
                }
            });
        }
    });
})

// best seller

module.exports = productRouter;
