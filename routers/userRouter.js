const express = require("express");
const bcrypt = require("bcrypt");
const Router = express.Router;
const userRouter = Router();
const UserModel = require("../models/users");
const nodemailer = require('nodemailer');

var rand, mailOptions, host, link;

userRouter.post('/register', (req, res) => {
    const newUser = req.body;
    const hashPassword = bcrypt.hashSync(newUser.password, 12);
    newUser.password = hashPassword;
    UserModel.create(newUser, (err) => {
        if (err) res.status(500).json({ success: 0, message: err })
        else {
            let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "tranhoanglinh11101998@gmail.com",
                pass: "linhdz123",
            }
        })
        rand = newUser._id;
        host = req.get('host');
        link = "http://" + req.get('host') + "/verify?id=" + rand;
        mailOptions = {
            from: "tranhoanglinh11101998@gmail.com",
            to: newUser.email,
            subject: "Please confirm your Email account of dormitory HUST",
            html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
        }
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) console.log(err)
            else {
                console.log("Email test" + info.response)
            }
        })
        }
    });
})

userRouter.get('/verifyAccount', (req, res) => {
    if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
        console.log("Domain is matched. Information is from Authentic email");
        if (req.query.id == rand) {
            UserModel.findOneAndUpdate({ _id: rand }, { $set: { status: "active" } }, (err, data) => {
                if (err) console.log(err)
                else console.log("email is verified");
                res.end("<h1>Email " + mailOptions.to + " is been Successfully verified");
            })
        }
        else {
            console.log("email is not verified");
            res.end("<h1>Bad Request</h1>");
        }
    }
    else {
        res.end("<h1>Request is from unknown source");
    }
})

module.exports = userRouter;