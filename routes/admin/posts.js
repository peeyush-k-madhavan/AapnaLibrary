const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const { uploadDir } = require("../../helpers/upload-helper");
const fs = require("fs");
const path = require("path");
const Post = require("../../models/Posts");
const Category = require("../../models/Category");
const { adminAuthenticated } = require("../../helpers/authentication");
// adminAuthenticated
router.all("/*", (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});

router.get("/", (req, res) => {
  Post.find({})
    .populate("category")
    .then((posts) => {
      res.render("admin/posts", { posts: posts });
    });
});

router.get("/edit/:id", (req, res) => {
  Post.findOne({ _id: req.params.id }).then((post) => {
    Category.find({}).then((categories) => {
      res.render("admin/posts/edit", { post: post, categories: categories });
    });
  });
});

router.put("/edit/:id", (req, res) => {
  Post.findOne({ _id: req.params.id }).then((post) => {
    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }
    post.title = req.body.title;
    post.status = req.body.status;
    post.allowComments = allowComments;
    post.body = req.body.body;
    post.category = req.body.category;

    post.save().then((updatedPost) => {
      req.flash("success_message", "The post was successfully updated");
      res.redirect("/admin/posts");
    });
  });
});

router.delete("/:id", (req, res) => {
  Post.findOne({ _id: req.params.id })
    .populate("comments")
    .then((post) => {
      fs.unlink(uploadDir + post.file, (err) => {
        if (!post.comments.length < 1) {
          post.comments.forEach((comment) => {
            comment.remove();
          });
        }
        post.remove().then((postRemoved) => {
          req.flash("success_message", "The post was successfully Deleted");
          res.redirect("/admin/posts");
        });
      });
    });
});
module.exports = router;
