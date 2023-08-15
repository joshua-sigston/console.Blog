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
const mongoose = require('mongoose');
const dbUrl = process.env.MONOGDB_URI || 'http://localhost:3000';
const secret = process.env.SECRET || 'thisshouldbeabettersecret!';
// const connectDB = require('./server/config/db');
// connectDB();

// app.use(session({
//   secret: 'keyboard cate',
//   resave: false,
//   saveUninitialized: true,
//   store: MongoStore.create({
//     mongoUrl: process.env.MONOGDB_URI
//   })
// }));
const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const connection = await mongoose.connect(`${dbUrl}`, {
       useNewUrlParser: true, 
       useUnifiedTopology: true,});
    console.log(`database connected: ${connection.connection.host}`);
  } catch (error) {
    console.log(error);
  }
}

connectDB()

// mongoose.connect(dbUrl, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//     console.log("Database connected");
// });

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
      secret: 'squirrel'
  }
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
  store,
  name: 'blog',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      // secure: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(session(sessionConfig));

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