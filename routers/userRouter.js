const express = require("express");
const bcrypt = require("bcrypt");
const Router = express.Router;
const userRouter = Router();
const UserModel = require("../models/users");

userRouter.post('/register', (req, res) => {
    console.log(req.body)
    const newUser = req.body;
    const hashPassword = bcrypt.hashSync(newUser.password, 12);
    newUser.password = hashPassword;
    UserModel.create(newUser, (err) => {
        if (err) res.status(500).json({ success: 0, message: err })
        else res.status(201).json({ success: 1, message: 'New User created success!' });
    });
})

module.exports = userRouter;