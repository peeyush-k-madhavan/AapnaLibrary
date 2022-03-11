const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const Post = require("../../models/Posts");
const { isEmpty, uploadDir } = require("../../helpers/upload-helper");
const fs = require("fs");
const path = require("path");

router.all("/*", (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});

router.get("/", (req, res) => {
  Post.find({}).then((posts) => {
    res.render("admin/posts", { posts: posts });
  });
});
router.get("/create", (req, res) => {
  res.render("admin/posts/create");
});
router.post("/create", (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ message: "Please add a Title" });
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
      file: filename,
    });

    newPost
      .save()
      .then((savedPost) => {
        console.log("Saved");
        console.log(savedPost);

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
    res.render("admin/posts/edit", { post: post });
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

    post.save().then((updatedPost) => {
      res.redirect("/admin/posts");
    });
  });
});

router.delete("/:id", (req, res) => {
  Post.findOne({ _id: req.params.id }).then((post) => {
    fs.unlink(uploadDir + post.file, (err) => {
      post.remove();
      res.redirect("/admin/posts");
    });
  });
});
module.exports = router;
