const express = require("express");
const app = express();
const path = require("path");
const expressHandlebars = require("express-handlebars");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/AAPNALibrary")
  .then((db) => {
    console.log("MongoDB Connected");
  })
  .catch((error) => console.log(error));

app.use(express.static(path.join(__dirname, "public")));

//Set View Engine
app.engine("handlebars", expressHandlebars.engine({ defaultLayout: "home" }));
app.set("view engine", "handlebars");

//Load Routes
const home = require("./routes/home/index");
const admin = require("./routes/admin/index");
const posts = require("./routes/admin/posts");

//Use Routes
app.use("/", home);
app.use("/admin", admin);
app.use("/admin/posts", posts);

app.listen(4500, () => {
  console.log(`Listening on Port 4500`);
});
