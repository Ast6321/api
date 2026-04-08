const express = require("express");
const userrouter  = express.Router();
const {register , login} = require("../controller/usercontroller");


userrouter.post("/register",register);
userrouter.post("/login", login);



module.exports = userrouter;