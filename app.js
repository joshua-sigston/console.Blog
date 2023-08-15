require('dotenv').config();

const express = require('express');
const layout = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser =require('cookie-parser');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');

const router = express.Router();
const app = express();
const PORT = process.env.PORT || 3000;

// connect DB
const MongoStore = require('connect-mongo');
var mongoose        =   require('mongoose');
// const connectDB = require('./server/config/db');
// connectDB();

// app.use(session({
//   secret: 'keyboard cate',
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({
//     mongoUrl: process.env.MONOGDB_URI,
//     touchAfter: 24 * 3600 
//   })
// }));

mongoose.connect(process.env.MONOGDB_URI,{useNewUrlParser: true, useUnifiedTopology: true}).catch(error => console.log("App.js mongoose.connect error",error));

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log("App is connected to DB", db.name)
});
mongoose.Promise = global.Promise;

app.use(session({
    secret: 'Your secret here',
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
      client: mongoose.connection.getClient(), //  as per the new versioning use client here and you can pass either the link or the same mongoose connection
      //Use above client if you want to use an existing connection


      // mongoUrl:"mongodb://localhost:27017/DBNAME",
      // or use this mongoUrl if you are passing the database URL straight away

      ttl: 1 * 6 * 60 * 60,  //ttl: 14 * 24 * 60 * 60, //days * hours * minutes * seconds
      autoRemove: 'native' // Default
    })
}));

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(fileUpload())

app.use(express.static('public'));
app.set('view engine', 'ejs');
// template engine
app.use(layout);
app.set('layout', './layouts/main');

app.use('/', require('./server/routes/main'));
// app.use('/', require('./server/routes/admin'))

app.use('/.netlify/functions/server', router);

app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});