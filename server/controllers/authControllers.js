const Post = require('../models/Post');
const User = require('../models/User');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secKey = 'fnsiiw4958nfslno34'
// const tip = require('../helpers/methods')
const auth = require('../helpers/auth')
// const api = require('../helpers/api')

// GET - gets profile page for users that hve logged in
exports.profileGET = async (req,res) => {
  const userID = req.session.user_id;
  
  if (!userID) {
    res.redirect('/login')
  } else {
    const posts = await Post.find();
    const userPosts = posts.filter(post => post.author === userID);
    const user = await User.findById({ _id: userID });
    res.render('profile', {user, userPosts})
  }
};

// GET - gets page to create a new post from user that is logged in
exports.create_postGET = (req, res) => {
  const user = req.session.user_id;

  if (!user) {
    res.redirect('/login')
  } else {
    res.render('create_post', {user})
  }
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

//GET - get edit page for post
exports.editGET = async (req, res) => {
  const user = req.session.user_id;

  if (!user) {
    res.redirect('/login')
  } else {
    try {
      // finds post with matching id aquired from webbrowser
      const post = await Post.findOne({ _id: req.params.id});

      res.render('edit_post', { user, post})
    } catch (error) {
      console.log(error);
    }
  }
};

//PUT - edit individual post by id
exports.editPUT = async (req, res) => {
  // const data = auth.isLoggedIn(req, res)
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