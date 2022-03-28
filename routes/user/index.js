const express = require("express");
const router = express.Router();
const Post = require("../../models/Posts");
const Category = require("../../models/Category");
const Admin = require("../../models/Admin");
const { userAuthenticated } = require("../../helpers/authentication");
// userAuthenticated
router.all("/*", userAuthenticated, (req, res, next) => {
  req.app.locals.layout = "user";
  next();
});

router.get("/", (req, res) => {
  res.render("user/index");
});

module.exports = router;
