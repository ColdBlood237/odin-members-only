const asyncHandler = require("express-async-handler");

const Message = require("../models/message");
const User = require("../models/user");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  const allMessages = await Message.find();
  res.render("index", { user: req.user, messages: allMessages });
});

exports.message_create_post = [
  body("title", "Title must be specified.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("content", "Message content cannot be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const newMessage = new Message({
      title: req.body.title,
      content: req.body.content,
      sender: req.user._id,
    });

    if (!errors.isEmpty()) {
      const allMessages = await Message.find();
      res.render("index", {
        user: req.user,
        messages: allMessages,
        errors: errors.array(),
      });
    } else {
      await newMessage.save();
      res.redirect("/");
    }
  }),
];
