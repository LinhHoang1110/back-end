const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductModel = new Schema({
    name: {type:String, required:true},
    imgUrl : {type: String, required: true},
    description: String,
    review: String,
    quantity: Number,
    id: String,
    price: {type: Number},
    category: String,
    brand: String,
    searchString : String
    
})
module.exports = mongoose.model('product',ProductModel);