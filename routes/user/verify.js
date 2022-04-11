const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const { isEmpty, uploadDir } = require("../../helpers/upload-helper");
const fs = require("fs");
const path = require("path");
router.all("/*", (req, res, next) => {
  req.app.locals.layout = "user";
  next();
});

router.get("/", (req, res) => {
  User.findOne({ _id: req.user.id }).then((user) => {
    res.render("user/verify", { user: user });
  });
});

router.put("/", (req, res) => {
  if (!req.files) {
    res.send("File was not found");
    return;
  } else {
    let card = req.files.card;
    filename = Date.now() + "-" + card.name;

    card.mv("./public/uploads/" + filename, (err) => {
      if (err) throw err;
    });
  }

  User.findOne({ _id: req.user.id }).then((user) => {
    user.card = filename;

    user.save().then((updatedUser) => {
      req.flash(
        "success_message",
        "Your ID is uploaded. Kindly Wait untill we verify your account"
      );
      res.redirect("/user");
    });
  });
});

module.exports = router;
