// Import Thư viện
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


// Import router api
const apiRouter = require('./routers/apiRouter');

// Khởi tạo Server
const app = express();

// Kết nối Database
mongoose.connect(
    'mongodb://localhost/shopvape',
    { useNewUrlParser: true },
    (err) => {
        if (err) console.log(err)
        else console.log('Database connect success!');
    }
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    // 4 Option cơ bản chủ yếu sẽ dùng
    secret: "nomeaning", // Lưu trữ cookie của trình duyệt
    resave: false, // Thuộc tính mỗi lần truy cập vào có ghi đè dữ liệu không
    saveUninitialized: false, // không save nếu người dùng không tương tác với dữ liệu
    cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 7 * 24 * 60 * 60 * 1000 // Hạn sử dụng Cookie
    }
}));



// Routes

app.use((req,res,next)=>{
	next();
})

app.use('/api', apiRouter);

// Chạy Server
app.listen(6969, (err) => {
    if (err) console.log(err);
    else console.log('Server start success!');
})