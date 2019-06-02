const express = require('express');
const Router = express.Router;
productRouter = Router();

// model 
const UserModel = require('../models/users');
const ProductModel = require('../models/product');
const ProductInfoModel = require('../models/productInfo');
const OrderModel = require('../models/order');
const helper = require('../utils/index');

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


//3. filter by category or brand
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


//5. show detail product 

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

productRouter.get('/order', (req, res) => {
    var user = req.user.userFound;
    OrderModel.findOne({'user': user, 'status': '0'}, (err, orderFound) => {
        if(err) res.json({success: 0, message:'order not found'});
        else res.json(orderFound);
    })
})

//6.add to cart
productRouter.get('/addToCart/:id/:quantity', (req, res) => {
    var user = req.user.userFound
    var idProduct = req.params.id;
    var quantity = req.params.quantity;
    ProductModel.findOne({ _id: idProduct }, (err, productFound) => {
        if (err) res.json({ success: 0, message: 'Product not found!' })
        else {
            var price = productFound.price;
            OrderModel.findOne({ 'user': user, 'status': '0' }, (err1, orderFound) => {
                if (err1) res.json({ success: 0, message: 'Order not found!' })
                else {
                    // khi không có giỏ hàng => tạo 
                    if (orderFound == null) {
                        var productInfoData = {
                            product: productFound,
                            quantity: quantity,
                            status: '0',
                            user: user._id
                        };
                        ProductInfoModel.create(productInfoData, (err2, productInfoCreated) => {
                            if (err2) res.json({ success: 0, message: 'Creating ProductInfo Fail!' });
                            else {
                                var orderData = {
                                    user: user._id,
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
                        ProductInfoModel.findOne({ 'product': productFound, 'user': user._id, 'status': '0' }, (err2, productInfoFound) => {
                            if (err2) res.json({ success: 0, message: 'ProductInfo not found!' })
                            else {
                                if (productInfoFound == null) {
                                    // đồ chưa có trong giỏ hàng, tạo mới productInfo, add vào order và update order lên db 
                                    var productInfoData = {
                                        product: productFound,
                                        quantity: quantity,
                                        status: '0',
                                        user: user._id
                                    };
                                    ProductInfoModel.create(productInfoData, (err3, productInfoCreated) => {
                                        if (err3) res.json({ success: 0, message: 'Creating ProductInfo Fail!' });
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
                                        quantity: `${Number(productInfoFound.quantity) + Number(quantity)}`,
                                        status: '0',
                                        user: user._id
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

// remove product 
productRouter.get('/removeInCart', (req, res) => {
    var user = req.user.userFound;
    var idProduct = req.query.idProduct;
    OrderModel.findOne({ 'user': user._id, 'status': '0' }, (err, orderFound) => {
        if (err) res.json({ success: 0, message: 'Order found fail!' });
        else {
            var listProduct = orderFound.productInfo;
            // ProductInfoModel.findOne({ product: idProduct }, (err, productFounded) => {
            //     var index = listProduct.indexOf(productFounded._id);
            //     listProduct.splice(index, 1);
            //     if (listProduct.length > 0) {
            //         OrderModel.findOneAndUpdate({ 'user': user._id }, { $set: { productInfo: listProduct } }, { new: true }, (err, updateOrder) => {
            //             console.log(updateOrder);
            //             if (err) res.json({ success: 0, message: "can not update" });
            //             else {
            //                 ProductInfoModel.findOneAndDelete({ product: idProduct }, (err) => {
            //                     if (err) console.log(err);
            //                     else console.log('delete product in producInfo success!!')
            //                 })
            //             }
            //         })
            //     }
            //     else {
            //         mongoose.connection.db.dropCollection('order', function (err, result) {
            //             if (err) console.log(err);
            //             mongoose.connection.db.dropCollection('productInfo', function (err) {
            //                 if (err) console.log(err);
            //                 else console.log('delete success');
            //             });
            //         });
            //     }
            // })
            ProductInfoModel.deleteOne({ product: idProduct }, (err1) => {
                if(err1) res.json({ success: 0, message: err1 })
                else {
                    listProduct.splice(listProduct.indexOf(idProduct), 1);
                    if (listProduct.length > 0) {
                        orderFound.productInfo = listProduct;
                        OrderModel.findByIdAndUpdate(orderFound._id, { $set: orderFound }, (err2, OrderUpdated) => {
                            if (err2) res.json({ success: 0, message: 'Order updated fail!' });
                            else res.json({ success: 1, message: 'Product deleted!' })
                        })
                    } else {
                        OrderModel.findByIdAndDelete(orderFound._id, (err2) => {
                            if (err2) res.json({ success: 0, message: 'Product delete fail!' });
                            else res.json({ success: 1, message: 'Product deleted!' })
                        })
                    }
                }
            });
        }
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



module.exports = productRouter;
