const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderModel = new Schema({
    user : { type: Schema.Types.ObjectId, ref: 'user' },
    productInfo : Array,
    cost : Number,
    address: String,
    status: {type: String,enum:['1', '0']}
})

module.exports = mongoose.model('order',OrderModel);