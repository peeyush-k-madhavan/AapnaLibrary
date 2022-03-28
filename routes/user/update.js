const express = require("express");
const router = express.Router();
const Post = require("../../models/Posts");
const Category = require("../../models/Category");
const Admin = require("../../models/Admin");
const User = require("../../models/User");

router.all("/*", (req, res, next) => {
  req.app.locals.layout = "user";
  next();
});

router.get("/", (req, res) => {
  User.findOne({ _id: req.user.id }).then((user) => {
    res.render("user/update", { user: user });
  });
});

router.put("/", (req, res) => {
  // res.send("WORKS");
  User.findOne({ _id: req.user.id }).then((user) => {
    user.headline = req.body.headline;
    user.birthday = req.body.birthday;
    user.status = req.body.status;
    user.city = req.body.city;
    user.district = req.body.district;
    user.state = req.body.state;
    user.pincode = req.body.pincode;

    // user.birthday = req.user.birthday;

    user.save().then((updatedUser) => {
      req.flash("success_message", "Your Profile was successfully updated");
      res.redirect("/user");
    });
  });
});

module.exports = router;
