const express = require("express");
const router = express.Router();
const Post = require("../../models/Posts");
const Category = require("../../models/Category");
const Admin = require("../../models/Admin");
const User = require("../../models/User");

router.all("/*", (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});

router.get("/", (req, res) => {
  const promises = [
    Post.count().exec(),
    Category.count().exec(),
    User.count().exec(),
  ];
  Promise.all(promises).then(([postCount, categoryCount, userCount]) => {
    res.render("admin/index", {
      postCount: postCount,
      categoryCount: categoryCount,
      userCount: userCount,
    });
  });
});

module.exports = router;
