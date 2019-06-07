const jwt = require('jsonwebtoken');


const auth = (req,res,next) => {
    const token = req.body.token || req.get('x-auth-token') || req.query.token;
    // if(token) {
    //     const user = jwt.verify(token,"aaaa")
    //     if(user){
    //         req.user = user
    //         next();
    //     }
    //     else {
    //         res.status(401).send({success: 0,message:"ban chua dang nhap"})
    //     }
    // }
    // else {
    //     res.status(401).send({success: 0,message:"ban chua dang nhap"})
    // }
}

module.exports = auth;