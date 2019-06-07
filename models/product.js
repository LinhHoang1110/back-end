const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// var mongoosePaginate = require('mongoose-paginate');

const ProductModel = new Schema({
    name: {type:String},
    imgUrl : {type: String},
    description: String,
    review: [{
        user : {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        username : String,
        comment : String,
    }],
    quantity: Number,
    id: String,
    price: {type: Number},
    category: String,
    brand: String,
    searchString : String
    
})
// ProductModel.plugin(mongoosePaginate);
module.exports = mongoose.model('product',ProductModel);