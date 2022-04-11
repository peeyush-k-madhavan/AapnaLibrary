const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const User = require("../../models/User");

router.all("/*", (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});

router.get("/", (req, res) => {
  User.find({}).then((users) => {
    res.render("admin/users", { users: users });
  });
});

router.get("/card/:id", (req, res) => {
  User.find({ _id: req.params.id }).then((users) => {
    res.render("admin/users/card", { users: users });
  });
});

router.put("/card/:id", (req, res) => {
  User.findOne({ _id: req.params.id }).then((user) => {
    if (req.body.verified) {
      verified = true;
    } else {
      verified = false;
    }
    user.verified = verified;
    user.save().then((updatedUser) => {
      req.flash("success_message", "ID Card Verification Status Changed");
      res.redirect("/admin/users");
    });
  });
});
module.exports = router;
