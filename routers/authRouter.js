const express = require('express');
const bcrypt = require('bcrypt');
const Router = express.Router;
const authRouter = Router();
const UserModel = require('../models/users');
const jwt = require('jsonwebtoken')

authRouter.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        UserModel.findOne({ username }, function (err, userFound) {
            if (err) res.status(500).json({ success: 0, message: err })
            else if (!userFound || !userFound._id) res.status(404).json({ success: 0, message: "Not found user in Database!" })
            else {
                if (bcrypt.compareSync(password, userFound.password)) {
                    const token = jwt.sign({userFound}, "aaaa")
                    res.json({userFound, token});
                } else res.status(401).json({ success: 0, message: "Wrong password!" });
            }
        })
    }
});


module.exports = authRouter;