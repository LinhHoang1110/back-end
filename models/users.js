const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserModel = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // email: {type: String,required:true},
    // user_status : {type: String, default: "deactive"}
});

module.exports = mongoose.model('user', UserModel);