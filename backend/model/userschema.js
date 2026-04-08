const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,   
    trim: true
  },

  password: {
    type: String,
    required: true
  },
  
  role: {
    type: String,
    enum: ["user", "admin"],  
    default: "user"
  }

}, { timestamps: true });  

module.exports = mongoose.model("User", userschema);