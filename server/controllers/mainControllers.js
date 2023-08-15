const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secKey = 'fnsiiw4958nfslno34'
const tip = require('../helpers/methods')
const auth = require('../helpers/auth')
const api = require('../helpers/api')

// GET - homepage
exports.homepage = async (req, res) => {
  // function to pic a method and display a method tip on homepage
  const method = tip.picMethod();
  // functionality to display weather or not user is logged in for header
  const user = req.session.user_id;
  // gets news articles to display news articles on homepage
  const articlesData = await api.newsAPI();
  // gets articles data with images
  let articles = [];
  articlesData.forEach( article => {
    if (article.provider[0].image === 'undefined') {
      articles.push('no image')
    } 

    if (article.provider[0].image) {
      articles.push(article)
    } 
  })
  // get latests posts to display on homepage
  const posts = await Post.find().sort({createdAt: -1}).limit(6);
  res.render('home', {user, articles, posts, method})
};

// GET - get about page
exports.aboutGET = (req, res) => {
  // functionality to display weather or not user is logged in for header
  const user = req.session.user_id;

  res.render('about', { user })
}

// GET - get contact page
exports.contactGET = (req, res) => {
  // functionality to display weather or not user is logged in for header
  const user = req.session.user_id;

  res.render('contact', { user })
}

// GET - get register page
exports.registerGET = (req, res) => {
  // functionality to display weather or not user is logged in for header
  const user = req.session.user_id;

  res.render('register', { user })
};

// POST - post data from register page to database
exports.registerPOST = async (req,res)=> {
  //  functionality to upload image to uploads folder
  let uploadPath;
  let newImageName;

    if(!req.files || Object.keys(req.files).length === 0) {
        console.log('no files were uploaded');
    } else {
        imageUpload = req.files.uploadImage
        newImageName = Date.now() + imageUpload.name

        uploadPath = require('path').resolve('./')+'/public/uploads/' + newImageName
        imageUpload.mv(uploadPath, (err) => {
            if(err) {
                return res.status(500).send(err)
            }
        });
    }

  try {
  // funcitonality to hide password
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);

  const user= await User({
        username: req.body.username,
        email: req.body.email,
        image: newImageName,
        password: hashedPass       
  });

    const newUser = await user.save();
    // res.status(200).json(resultPost);
    res.redirect('/');
  } catch (error) {
      res.status(500).json(error); 
  };
};

// GET - get login page
exports.loginGET = (req, res) => {
   // functionality to display weather or not user is logged in for header
   const user = req.session.user_id;

  res.render('login', { user });
}

// POST - data from login page to database in order to compare user sign in with user data
exports.loginPOST = async (req,res) => {
  
  // functionality to find user from database and compare passwords
  try {
    const {username, password} = req.body;
    const user = await User.findOne({ username });
    const passwordCheck = bcrypt.compareSync(password, user.password);
      
    passwordCheck ? jwt.sign({username,id:user._id}, secKey, {}, (err, token) => {
      if (err) throw err
      // create token to track user log in while navigating site
      res.cookie('token', token, { httpOnly: true});

      req.session.user_id = user._id;

      res.redirect('profile');
    }): res.status(400).json('wrong credentials')
  } catch (error) {
    res.status(500).json(error); 
  }
};

// GET - logout page to logout user and clear token
exports.logoutGET = (req, res) => {
  // clears token on logout
  res.clearCookie('token');
  req.session.user_id = undefined;
  // res.json({ message: 'Logout Successsful'});
  res.redirect('/');
}

// GET - individual post by id
exports.postGET = async (req, res) => {
  const user = req.session.user_id;
  try {
    let id = req.params.id;
    // find post within database
    const post = await Post.findById({ _id: id });
    const user = await User.findById({_id: post.author});
    //  res.json(data)
    res.render('post', {user, post, user});
  } catch (error) {
    console.log(error)
  }
  };