const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const connection = await mongoose.connect(process.env.MONOGDB_URI, {
       useNewUrlParser: true, 
       useUnifiedTopology: true});
    console.log(`database connected: ${connection.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;