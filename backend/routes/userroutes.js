const express = require("express");
const userrouter  = express.Router();
const {register , login, logout} = require("../controller/usercontroller");


userrouter.post("/register",register);
userrouter.post("/login", login);
userrouter.post("/logout", logout);


module.exports = userrouter;