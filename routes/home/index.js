const express = require("express");
const router = express.Router();
const Post = require("../../models/Posts");
const Category = require("../../models/Category");
const Admin = require("../../models/Admin");
const User = require("../../models/User");
const ContactMessage = require("../../models/ContactMessage");
const Comment = require("../../models/Comment");

const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

router.all("/*", (req, res, next) => {
  req.app.locals.layout = "home";
  next();
});

router.get("/", (req, res) => {
  const perPage = 5;
  const page = req.query.page || 1;
  Post.find({})
    .skip(perPage * page - perPage)
    .limit(perPage)
    .populate("user")
    .then((posts) => {
      Post.count().then((postCount) => {
        Category.find({}).then((categories) => {
          res.render("home/index", {
            posts: posts,
            categories: categories,
            current: parseInt(page),
            pages: Math.ceil(postCount / perPage),
          });
        });
      });
    });
});

router.get("/about", (req, res) => {
  res.render("home/about");
});

router.get("/login", (req, res) => {
  res.render("home/login");
});

//APP LOGIN

passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    User.findOne({ email: email }).then((user) => {
      if (!user) return done(null, false, { message: "No User Found!" });
      bcrypt.compare(password, user.password, (err, matched) => {
        if (err) return err;
        if (matched) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect Password." });
        }
      });
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/user",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/register", (req, res) => {
  res.render("home/register");
});

router.post("/register", (req, res) => {
  let errors = [];
  if (!req.body.firstName) {
    errors.push({ message: "Please enter your First Name." });
  }
  if (!req.body.lastName) {
    errors.push({ message: "Please enter your Last Name." });
  }
  if (!req.body.email) {
    errors.push({ message: "Please enter your Email." });
  }
  if (!req.body.password) {
    errors.push({ message: "Please enter a Password." });
  }
  if (req.body.password && !req.body.passwordConfirm) {
    errors.push({ message: "Please confirm your Password." });
  }

  if (req.body.password !== req.body.passwordConfirm) {
    errors.push({ message: "Password fileds don't match." });
  }

  if (errors.length > 0) {
    res.render("home/register", {
      errors: errors,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    });
  } else {
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password,
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser
              .save()
              .then((savedUser) => {
                req.flash(
                  "success_message",
                  "You are now registered, please Login."
                );
                res.redirect("/login");
              })
              .catch((error) => {
                console.log("Could not Save Data");
              });
          });
        });
      } else {
        req.flash("error_message", "Email already exists. Please Login.");
        res.redirect("/login");
      }
    });
  }
});

router.get("/contact", (req, res) => {
  res.render("home/contact");
});

router.post("/contact", (req, res) => {
  const newContactMessage = new ContactMessage({
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.message,
  });

  newContactMessage
    .save()
    .then((savedContactMessage) => {
      req.flash(
        "success_message",
        "You message has been sent. Our Admins will contact you back soon."
      );
      res.redirect("/");
    })
    .catch((error) => {
      console.log("Could not Save Data");
    });
});

router.get("/post/:id", (req, res) => {
  Post.findOne({ _id: req.params.id })
    .populate({ path: "comments", populate: { path: "user", model: "users" } })
    .populate("user")
    .then((post) => {
      Category.find({}).then((categories) => {
        res.render("home/post", { post: post, categories: categories });
      });
    });
});

router.get("/users/:id", (req, res) => {
  User.findOne({ _id: req.params.id }).then((user) => {
    Post.find({ user: req.params.id }).then((posts) => {
      res.render("home/users", {
        user: user,
        posts: posts,
      });
    });
    // res.render("home/users", { user: user });
  });
});

module.exports = router;
