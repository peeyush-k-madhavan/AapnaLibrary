const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const { isEmpty, uploadDir } = require("../../helpers/upload-helper");
const fs = require("fs");
const path = require("path");
const Post = require("../../models/Posts");
const Category = require("../../models/Category");
const { adminAuthenticated } = require("../../helpers/authentication");
// adminAuthenticated
router.all("/*", (req, res, next) => {
  req.app.locals.layout = "user";
  next();
});

router.get("/", (req, res) => {
  Post.find({ user: req.user.id })
    .populate("category")
    .then((posts) => {
      res.render("user/posts", { posts: posts });
    });
});
router.get("/create", (req, res) => {
  Category.find({}).then((categories) => {
    res.render("user/posts/create", { categories: categories });
  });
});
router.post("/create", (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ message: "Please add a Title" });
  }
  if (!req.body.body) {
    errors.push({ message: "Please add a Description" });
  }
  if (errors.length > 0) {
    res.render("user/posts/create", { errors: errors });
  } else {
    let filename = "nofile.jpg";
    if (!req.files) {
      res.send("File was not found");
      return;
    } else {
      let file = req.files.file;
      filename = Date.now() + "-" + file.name;

      file.mv("./public/uploads/" + filename, (err) => {
        if (err) throw err;
      });
    }

    // res.send("Worked");
    let allowComments = true;
    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }
    const newPost = new Post({
      user: req.user.id,
      title: req.body.title,
      status: req.body.status,
      allowComments: allowComments,
      body: req.body.body,
      category: req.body.category,
      file: filename,
    });

    newPost
      .save()
      .then((savedPost) => {
        req.flash(
          "success_message",
          `A post titled: ${savedPost.title} was created successfully`
        );
        res.redirect("/user/posts");
      })
      .catch((error) => {
        console.log("Could not Save Data");
      });
    // console.log(req.body);
  }
});

router.get("/edit/:id", (req, res) => {
  // res.send(req.params.id);

  Post.findOne({ _id: req.params.id }).then((post) => {
    Category.find({}).then((categories) => {
      res.render("user/posts/edit", { post: post, categories: categories });
    });
  });
  // res.render("admin/posts/edit");
});

router.put("/edit/:id", (req, res) => {
  // res.send("WORKS");
  Post.findOne({ _id: req.params.id }).then((post) => {
    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }
    post.user = req.user.id;
    post.title = req.body.title;
    post.status = req.body.status;
    post.allowComments = allowComments;
    post.body = req.body.body;
    post.category = req.body.category;

    post.save().then((updatedPost) => {
      req.flash("success_message", "The post was successfully updated");
      res.redirect("/user/posts");
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
          res.redirect("/user/posts");
        });
      });
    });
});
module.exports = router;
