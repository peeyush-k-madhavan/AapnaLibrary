const express = require("express");
const router = express.Router();
const ContactMessage = require("../../models/ContactMessage");

const req = require("express/lib/request");

router.all("/*", (req, res, next) => {
  req.app.locals.layout = "user";
  next();
});

router.get("/", (req, res) => {
  ContactMessage.find({}).then((messages) => {
    res.render("admin/message", { messages: messages });
  });
});
router.delete("/:id", (req, res) => {
  ContactMessage.findByIdAndRemove(req.params.id).then((deleteItem) => {
    res.redirect("/admin/message");
  });
});

module.exports = router;
