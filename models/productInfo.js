const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productInfoModel = new Schema({
    product : { type: Schema.Types.ObjectId, ref: 'product' },
    quantity : Number,
    status: {type: String, enum:['1', '0']},
    user : { type: Schema.Types.ObjectId, ref: 'user' }
})

module.exports = mongoose.model('productInfo',productInfoModel);