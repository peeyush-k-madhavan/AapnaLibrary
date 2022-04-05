const express = require("express");
const router = express.Router();
const Message = require("../../models/Message");
const Conversation = require("../../models/Conversation");

const req = require("express/lib/request");

router.all("/*", (req, res, next) => {
  req.app.locals.layout = "user";
  next();
});

router.get("/", (req, res) => {
  res.render("user/message");
});

router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderid, req.body.receiverid],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.send(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.user.id] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.send(err);
  }
});

router.post("/messages", async (req, res) => {
  const newMessage = new Message(req.body);
  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.send(err);
  }
});

router.get("/messages/", async (req, res) => {
  // try {
  //   const messages = await Message.find({
  //     conversationID: req.params.conversationID,
  //   });
  //   res.status(200).json(messages);
  //   res.render("user/messages");
  // } catch (err) {
  //   res.send(err);
  // }
  res.render("user/message/messages");
});

module.exports = router;
