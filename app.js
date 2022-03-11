const express = require("express");
const app = express();
const path = require("path");
const expressHandlebars = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const upload = require("express-fileupload");

mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://127.0.0.1:27017/AAPNALibrary")
  .then((db) => {
    console.log("MongoDB Connected");
  })
  .catch((error) => console.log(error));

app.use(express.static(path.join(__dirname, "public")));

//Set View Engine
// app.engine("handlebars", expressHandlebars.engine({ defaultLayout: "home" }));
const { select } = require("./helpers/handlebars-helpers");

app.engine(
  "handlebars",
  expressHandlebars.engine({
    defaultLayout: "home",
    helpers: { select: select },
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", "handlebars");

//Upload Middleware
app.use(upload());

//BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Method Override
app.use(methodOverride("_method"));

//Load Routes
const home = require("./routes/home/index");
const admin = require("./routes/admin/index");
const posts = require("./routes/admin/posts");
const req = require("express/lib/request");

//Use Routes
app.use("/", home);
app.use("/admin", admin);
app.use("/admin/posts", posts);

app.listen(4500, () => {
  console.log(`Listening on Port 4500`);
});
