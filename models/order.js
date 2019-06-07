const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderModel = new Schema({
    address: Object,
    paymentID :String,
    email: String,
    payerID: String,
    products : Array
})

module.exports = mongoose.model('order',OrderModel);