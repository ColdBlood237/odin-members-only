const asyncHandler = require("express-async-handler");

const Message = require("../models/message");
const User = require("../models/user");

exports.index = asyncHandler(async (req, res, next) => {
  const allMessages = await Message.find();
  res.render("index", { user: req.user, messages: allMessages });
});
