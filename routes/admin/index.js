const express = require("express");
const router = express.Router();
const Post = require("../../models/Posts");
const Category = require("../../models/Category");
const Admin = require("../../models/Admin");

router.all("/*", (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});

router.get("/", (req, res) => {
  Post.count().then((postCount) => {
    Category.count().then((categoryCount) => {
      Admin.count().then((adminCount) => {
        res.render("admin/index", {
          postCount: postCount,
          categoryCount: categoryCount,
          adminCount: adminCount,
        });
      });
    });
  });
});

module.exports = router;
