const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderModel = new Schema({
    address: Object,
    email: String,
    payerID: String,
    product : {
        type: Schema.Types.ObjectId,
        ref : "product"
    }
})

module.exports = mongoose.model('order',OrderModel);