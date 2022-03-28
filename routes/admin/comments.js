const express = require("express");
const router = express.Router();
const Post = require("../../models/Posts");
const Comment = require("../../models/Comment");
const Admin = require("../../models/Admin");
const req = require("express/lib/request");

router.all("/*", (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});

router.get("/", (req, res) => {
  Comment.find({})
    .populate("user")
    .then((comments) => {
      res.render("admin/comments", { comments: comments });
    });
});

router.post("/", (req, res) => {
  Post.findOne({ _id: req.body.id }).then((post) => {
    const newComment = new Comment({
      user: req.user.id,
      body: req.body.body,
      post: post.id,
    });
    post.comments.push(newComment);
    post.save().then((savedPost) => {
      newComment
        .save()
        .then((savedComment) => {
          res.redirect(`/post/${post.id}`);
        })
        .catch((error) => {
          console.log("Could not Save Comment");
        });
    });
  });
});

router.delete("/:id", (req, res) => {
  Comment.findByIdAndRemove(req.params.id).then((deleteItem) => {
    Post.findOneAndUpdate(
      { comments: req.params.id },
      { $pull: { comments: req.params.id } },
      (err, data) => {
        if (err) console.log(err);
        res.redirect("/admin/comments");
      }
    );
  });
});

module.exports = router;
