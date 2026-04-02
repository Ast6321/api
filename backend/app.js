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

module.exports = app;