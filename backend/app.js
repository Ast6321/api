const express = require("express");
const cors = require("cors");


const app = express();

// middlewares
app.use(cors({origin:"*"}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static folder
app.use("/uploads", express.static("uploads"));

// routes
const router = require("./routes/categoryroutes");
app.use("/categories",router)

const productrouter = require("./routes/productrouter");
app.use("/products" , productrouter);

const cartrouter = require("./routes/cartroutes");
app.use("/cart" , cartrouter);

const userrouter = require("./routes/userroutes");
app.use("/user" , userrouter)

module.exports = app;