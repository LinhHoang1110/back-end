// Import Thư viện
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');


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

var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    callback(null, corsOptions) // callback expects two parameters: error and options
  }
  
app.use(cors(corsOptionsDelegate));
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
const port = process.env.port || 6969;

app.listen(port, (err) => {
    if (err) console.log(err);
    else console.log('Server start success!');
})