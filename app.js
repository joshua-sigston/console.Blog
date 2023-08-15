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
const connectDB = require('./server/config/db');
connectDB();

app.use(session({
  secret: 'keyboard cate',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONOGDB_URI,
    touchAfter: 24 * 3600 
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