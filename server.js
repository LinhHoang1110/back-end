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

// mongoose.connect('mongodb://linh:linhdz123@ds231207.mlab.com:31207/mindx_lc_commerce', {useMongoClient: true}, function(err){
//     if(err) {
//         console.log('Some problem withl the connection ' +err);
//     } else {
//         console.log('The Mongoose connection is ready');
//     }
// })
mongodb://<dbuser>:<dbpassword>@ds231207.mlab.com:31207/mindx_lc_commerce
mongoose.connect('mongodb://linh:linhdz123@ds231207.mlab.com:31207/mindx_lc_commerce', {useMongoClient: true}, function(err){
    if(err) {
        console.log('Some problem with the connection ' +err);
    } else {
        console.log('The Mongoose connection is ready');
    }
})

var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    callback(null, corsOptions) // callback expects two parameters: error and options
  }
  
app.use(cors(corsOptionsDelegate));

// app.use(cors({
//     origin: ["http://localhost:3000","https://lc-commerce.herokuapp.com"],
//     credentials: true
//   }));
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes


app.use((req,res,next)=>{
	next();
})

app.use('/api', apiRouter);

// Chạy Server
const port = process.env.PORT || 6969;

app.listen(port, (err) => {
    if (err) console.log(err);
    else console.log('Server start success!');
})