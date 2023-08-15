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
  const data = auth.isLoggedIn(req, res);
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

  res.render('home', {data, articles, posts, method})
};

// GET - get about page
exports.aboutGET = (req, res) => {
  // functionality to display weather or not user is logged in for header
  const data = auth.isLoggedIn(req, res)

  res.render('about', {data})
}

// GET - get contact page
exports.contactGET = (req, res) => {
  // functionality to display weather or not user is logged in for header
  const data = auth.isLoggedIn(req, res)

  res.render('contact', {data})
}

// GET - get register page
exports.registerGET = (req, res) => {
  // functionality to display weather or not user is logged in for header
  const data = auth.isLoggedIn(req, res)

  res.render('register', {data})
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
  const data = auth.isLoggedIn(req, res);

  res.render('login', {data});
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
  // res.json({ message: 'Logout Successsful'});
  res.redirect('/');
}
 
// GET - gets profile page for users that hve logged in
exports.profileGET = async (req,res) => {
    const { token } = req.cookies;
    let data
    jwt.verify(token, secKey, {}, (err, info) => {
      if (err) throw err;
      // res.json(info);
      data = info;
    });
    const posts = await Post.find();
    const userPosts = posts.filter(post => post.author === data.id);
    const user = await User.findById({ _id: data.id });
    res.render('profile', {data, user, userPosts})
  };

// GET - gets page to create a new post from user that is logged in
exports.create_postGET = (req, res) => {
  const data = auth.isLoggedIn(req, res)
  res.render('create_post', {data})
}

exports.postDELETE = async (req, res) => {
  try {
    const deletedPost = await Post.deleteOne({ _id: req.params.id});
    console.log(deletedPost)
    res.redirect('/profile')
  } catch (error) {
    console.group(error);
  }
}

// POST - sends data to database
exports.create_postPOST = async (req, res) => {
  const data = auth.isLoggedIn(req, res)
  //  functionality to upload image to uploads folder
  let imageUpload
  let uploadPath
  let newImageName
    if(!req.files || Object.keys(req.files).length === 0) {
        console.log('no files were uploaded')
    } else {
        imageUpload = req.files.uploadImage
        newImageName = Date.now() + imageUpload.name

        uploadPath = require('path').resolve('./')+'/public/uploads/' + newImageName
        imageUpload.mv(uploadPath, (err) => {
            if(err) {
                return res.status(500).send(err)
            }
        })
    }

  try {
    const post = await Post.create({
      title: req.body.title,
      body: req.body.body,
      image: newImageName,
      author: data.id,
    })
    // res.json(post)
    res.redirect('profile')
  } catch (error) {
    console.log(error)
  }
}

// GET - individual post by id
exports.postGET = async (req, res) => {
  const data = auth.isLoggedIn(req, res)
  try {
    let id = req.params.id;
    // find post within database
    const post = await Post.findById({ _id: id });
    //  res.json(data)
    res.render('post', {data, post});
  } catch (error) {
    console.log(error)
  }
};

//GET - get edit page for post
exports.editGET = async (req, res) => {
  const data = auth.isLoggedIn(req, res)
  try {
    // finds post with matching id aquired from webbrowser
    const post = await Post.findOne({ _id: req.params.id});
  
    res.render('edit_post', {data, post})
  } catch (error) {
    console.log(error);
  }
};

//PUT - edit individual post by id
exports.editPUT = async (req, res) => {
    const data = auth.isLoggedIn(req, res)
    let imageUpload
    let uploadPath
    let newImageName

    if(!req.files || Object.keys(req.files).length === 0) {
        console.log('no files were uploaded')
    } else {
        imageUpload = req.files.uploadImage
        newImageName = Date.now() + imageUpload.name

        uploadPath = require('path').resolve('./')+'/public/uploads/' + newImageName
        imageUpload.mv(uploadPath, (err) => {
            if(err) {
                return res.status(500).send(err)
            }
        })
    }

    try {
      await Post.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body,
        image: null,
        author: data.id,
      });
      res.redirect(`/edit_post/${req.params.id}`);
    } catch (error) {
      console.log(error);
    }
}

// const articles = [
//   {
//     type:"NewsArticle",
//     name:"Why 20 Percent of Web Developers Are Wary Of Using AI",
//     url:"https://www.benzinga.com/pressreleases/23/08/33586174/why-20-percent-of-web-developers-are-wary-of-using-ai",
//     description:"It is estimated that 20 percent of web developers are not using AI for website design tasks and related assignments. Are you among these web developers? Many people still prefer",
//     provider:
//     [
//       {
//         _type:"Organization",
//       name:"Benzinga.com",
//       image:
//         {
//           _type:"ImageObject",
//           thumbnail:
//           {
//             _type:"ImageObject",
//           contentUrl:"https://www.bing.com/th?id=ODF.LnWAsYULk4XKw3udkffflQ&pid=news"
//           }
//         }
//       }
//     ],
//     datePublished:"2023-08-05T05:26:00.0000000Z",
//     category:"ScienceAndTechnology"
//   },
//   {
//     type:"NewsArticle",
//     name:"Why 20 Percent of Web Developers Are Wary Of Using AI",
//     url:"https://www.benzinga.com/pressreleases/23/08/33586174/why-20-percent-of-web-developers-are-wary-of-using-ai",
//     description:"It is estimated that 20 percent of web developers are not using AI for website design tasks and related assignments. Are you among these web developers? Many people still prefer",
//     provider:
//     [
//       {
//         _type:"Organization",
//       name:"Benzinga.com",
//       image:
//         {
//           _type:"ImageObject",
//           thumbnail:
//           {
//             _type:"ImageObject",
//           contentUrl:"https://www.bing.com/th?id=ODF.LnWAsYULk4XKw3udkffflQ&pid=news"
//           }
//         }
//       }
//     ],
//     datePublished:"2023-08-05T05:26:00.0000000Z",
//     category:"ScienceAndTechnology"
//   },
//   {
//     type:"NewsArticle",
//     name:"Why 20 Percent of Web Developers Are Wary Of Using AI",
//     url:"https://www.benzinga.com/pressreleases/23/08/33586174/why-20-percent-of-web-developers-are-wary-of-using-ai",
//     description:"It is estimated that 20 percent of web developers are not using AI for website design tasks and related assignments. Are you among these web developers? Many people still prefer",
//     provider:
//     [
//       {
//         _type:"Organization",
//       name:"Benzinga.com",
//       image:
//         {
//           _type:"ImageObject",
//           thumbnail:
//           {
//             _type:"ImageObject",
//           contentUrl:"https://www.bing.com/th?id=ODF.LnWAsYULk4XKw3udkffflQ&pid=news"
//           }
//         }
//       }
//     ],
//     datePublished:"2023-08-05T05:26:00.0000000Z",
//     category:"ScienceAndTechnology"
//   },
//   {
//     type:"NewsArticle",
//     name:"Why 20 Percent of Web Developers Are Wary Of Using AI",
//     url:"https://www.benzinga.com/pressreleases/23/08/33586174/why-20-percent-of-web-developers-are-wary-of-using-ai",
//     description:"It is estimated that 20 percent of web developers are not using AI for website design tasks and related assignments. Are you among these web developers? Many people still prefer",
//     provider:
//     [
//       {
//         _type:"Organization",
//       name:"Benzinga.com",
//       image:
//         {
//           _type:"ImageObject",
//           thumbnail:
//           {
//             _type:"ImageObject",
//           contentUrl:"https://www.bing.com/th?id=ODF.LnWAsYULk4XKw3udkffflQ&pid=news"
//           }
//         }
//       }
//     ],
//     datePublished:"2023-08-05T05:26:00.0000000Z",
//     category:"ScienceAndTechnology"
//   },
  
  
// ]
