require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT;


const morgan = require("morgan");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(cors());

app.use(async function (req, res, next) {
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Accept", "*/*");
  res.setHeader("Content-Type", "application/json");
  
  next();
});


app.listen(port, function (err) {
  if (err) {
    console.log("error in starting server");
    return;
  }
  console.log("server is running on port : ", port);
});

app.use("/", require("./routes"));


module.exports = app;