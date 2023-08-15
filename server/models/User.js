const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username:{
      type: String,
      required: true,
      unique:true,
      min:3,
      max:20
  },
  email:{
     type: String,
      required: true,
      unique:true
  },
  image: { 
      type: String, 
   },
  password:{
     type: String,
     required: true,
     min:3,
     max:10
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
 }]

},

{timestamps: true}

);

module.exports = mongoose.model('User', UserSchema);