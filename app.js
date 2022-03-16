const express = require("express");
const app = express();
const path = require("path");
const expressHandlebars = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const upload = require("express-fileupload");
const session = require("express-session");
const flash = require("connect-flash");

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
const { select, generateDate } = require("./helpers/handlebars-helpers");

app.engine(
  "handlebars",
  expressHandlebars.engine({
    defaultLayout: "home",
    helpers: { select: select, generateDate: generateDate },
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

//Session
app.use(
  session({
    secret: "aapnalibrary",
    resave: true,
    saveUninitialized: true,
  })
);

//Flash

app.use(flash());

//LOCAL Variable using Middleware

app.use((req, res, next) => {
  res.locals.success_message = req.flash("success_message");
  res.locals.error_message = req.flash("error_message");
  next();
});

//Load Routes
const home = require("./routes/home/index");
const admin = require("./routes/admin/index");
const posts = require("./routes/admin/posts");
const categories = require("./routes/admin/categories");

const req = require("express/lib/request");

//Use Routes
app.use("/", home);
app.use("/admin", admin);
app.use("/admin/posts", posts);
app.use("/admin/categories", categories);

app.listen(4500, () => {
  console.log(`Listening on Port 4500`);
});
