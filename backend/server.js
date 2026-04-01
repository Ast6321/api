require("dotenv").config();
const app = require("./app");
const database = require("./config/database");

const PORT = process.env.PORT ||7000;
// database connect
database();

// server start
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});