const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderModel = new Schema({
    address: Object,
    email: String,
    payerID: String,
})

module.exports = mongoose.model('order',OrderModel);