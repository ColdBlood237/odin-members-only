const asyncHandler = require("express-async-handler");

const Message = require("../models/message");
const User = require("../models/user");

exports.index = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED YET: Homepage");
});
