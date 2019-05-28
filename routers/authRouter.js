const express = require('express');
const bcrypt = require('bcrypt');
const Router = express.Router;
const authRouter = Router();
const UserModel = require('../models/users');

authRouter.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        UserModel.findOne({ username }, function (err, userFound) {
            if (err) res.status(500).json({ success: 0, message: err })
            else if (!userFound || !userFound._id) res.status(404).json({ success: 0, message: "Not found user in Database!" })
            else {
                if (bcrypt.compareSync(password, userFound.password)) {
                    const { _id } = userFound;
                    req.session.userInfo = { _id };
                    res.json({ success: 1, message: "Login successfully!" });
                } else res.status(401).json({ success: 0, message: "Wrong password!" });
            }
        })
    }
});

authRouter.delete('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: 1, message: "Logout success!" });
});

authRouter.get('/me', (req, res) => {
    if(!req.session.userInfo){
        res.status(401).send({success:0,message:"ban chua dang nhap"})
    }
    else{
        UserModel.findOne({username:req.session.userInfo.username},"-password",(err,userInfo)=>{
            res.send({success:1,message: userInfo})
        })
    }
})

module.exports = authRouter;