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
const pincodeDirectory = require("india-pincode-lookup");
const { mongoDBUrl } = require("./config/database");
const passport = require("passport");

mongoose.Promise = global.Promise;
mongoose
  .connect(mongoDBUrl)
  .then((db) => {
    console.log("MongoDB Connected");
  })
  .catch((error) => console.log(error));

app.use(express.static(path.join(__dirname, "public")));

//Set View Engine
// app.engine("handlebars", expressHandlebars.engine({ defaultLayout: "home" }));
const {
  select,
  generateDate,
  calcAge,
  paginate,
} = require("./helpers/handlebars-helpers");

app.engine(
  "handlebars",
  expressHandlebars.engine({
    defaultLayout: "home",
    helpers: {
      select: select,
      generateDate: generateDate,
      paginate: paginate,
      calcAge: calcAge,
    },
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

app.use(passport.initialize());
app.use(passport.session());

//LOCAL Variable using Middleware

app.use((req, res, next) => {
  // res.locals.admin = req.user || null;
  res.locals.user = req.user || null;
  res.locals.success_message = req.flash("success_message");
  res.locals.error_message = req.flash("error_message");
  res.locals.error = req.flash("error");
  next();
});

//Load Routes
const home = require("./routes/home/index");
const admin = require("./routes/admin/index");
const user = require("./routes/user/index");
const adminposts = require("./routes/admin/posts");
const admincategories = require("./routes/admin/categories");
const admincomments = require("./routes/admin/comments");
const adminmessages = require("./routes/admin/message");
const userposts = require("./routes/user/posts");
const usercomments = require("./routes/user/comments");
const userupdate = require("./routes/user/update");
const usermessages = require("./routes/user/message");

const req = require("express/lib/request");

//Use Routes
app.use("/", home);
app.use("/admin", admin);
app.use("/user", user);
app.use("/admin/posts", adminposts);
app.use("/admin/categories", admincategories);
app.use("/admin/comments", admincomments);
app.use("/admin/message", adminmessages);
app.use("/user/posts", userposts);
app.use("/user/comments", usercomments);
app.use("/user/update", userupdate);
app.use("/user/message", usermessages);

app.listen(4500, () => {
  console.log(`Listening on Port 4500`);
});
