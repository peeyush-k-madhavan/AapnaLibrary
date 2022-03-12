const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const { isEmpty, uploadDir } = require("../../helpers/upload-helper");
const fs = require("fs");
const path = require("path");
const Post = require("../../models/Posts");
const Category = require("../../models/Category");

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
router.get("/create", (req, res) => {
  Category.find({}).then((categories) => {
    res.render("admin/posts/create", { categories: categories });
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
    res.render("admin/posts/create", { errors: errors });
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
        res.redirect("/admin/posts");
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
      res.render("admin/posts/edit", { post: post, categories: categories });
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
    post.title = req.body.title;
    post.status = req.body.status;
    post.allowComments = allowComments;
    post.body = req.body.body;
    post.category = req.body.category;

    if (!req.files) {
      res.send("File was not found");
      return;
    } else {
      let file = req.files.file;
      filename = Date.now() + "-" + file.name;
      post.file = filename;

      file.mv("./public/uploads/" + filename, (err) => {
        if (err) throw err;
      });
    }

    post.save().then((updatedPost) => {
      req.flash("success_message", "The post was successfully updated");
      res.redirect("/admin/posts");
    });
  });
});

router.delete("/:id", (req, res) => {
  Post.findOne({ _id: req.params.id }).then((post) => {
    fs.unlink(uploadDir + post.file, (err) => {
      post.remove();
      // req.flash("success_message", "The post was successfully Deleted");
      res.redirect("/admin/posts");
    });
  });
});
module.exports = router;
