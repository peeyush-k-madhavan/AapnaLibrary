const express = require("express");
const router = express.Router();
const Post = require("../../models/Posts");
const Category = require("../../models/Category");
const Admin = require("../../models/Admin");
const bcrypt = require("bcryptjs");

router.all("/*", (req, res, next) => {
  req.app.locals.layout = "home";
  next();
});

router.get("/", (req, res) => {
  Post.find({}).then((posts) => {
    Category.find({}).then((categories) => {
      res.render("home/index", { posts: posts, categories: categories });
    });
  });
});

router.get("/about", (req, res) => {
  res.render("home/about");
});

router.get("/login", (req, res) => {
  res.render("home/login");
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
    Admin.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        const newAdmin = new Admin({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password,
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newAdmin.password, salt, (err, hash) => {
            newAdmin.password = hash;
            newAdmin
              .save()
              .then((savedAdmin) => {
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
router.get("/post/:id", (req, res) => {
  Post.findOne({ _id: req.params.id }).then((post) => {
    Category.find({}).then((categories) => {
      res.render("home/post", { post: post, categories: categories });
    });
  });
});

module.exports = router;
