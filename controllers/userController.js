const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/user");
const Message = require("../models/message");
const passport = require("passport");

exports.user_create_get = asyncHandler(async (req, res, next) => {
  res.render("sign-up-form");
});

exports.user_create_post = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("last_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("last name must be specified.")
    .isAlphanumeric()
    .withMessage("last name has non-alphanumeric characters."),
  body("username")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Email must be specified.")
    .isEmail()
    .withMessage("Invalid email."),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Password must be specified."),
  body("confirm_password")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords must match."),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    let newUser = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      membership_status: false,
    });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    newUser.password = hashedPassword;

    if (!errors.isEmpty()) {
      res.render("sign-up-form", { user: newUser, errors: errors.array() });
    } else {
      const userExists = await User.findOne({ username: newUser.username });
      if (userExists) {
        res.render("sign-up-form", {
          user: newUser,
          errors: [{ msg: "Email already used." }],
        });
      } else {
        await newUser.save();
        req.login(newUser, function (err) {
          if (err) {
            return next(err);
          }
          return res.redirect("/");
        });
      }
    }
  }),
];

exports.user_login_get = asyncHandler((req, res, next) => {
  res.render("log-in-form", { errors: req.session.messages });
});

exports.user_login_post = [
  function (req, res, next) {
    req.session.messages = [];
    next();
  },
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
    failureMessage: true,
  }),
];

exports.user_logout_get = asyncHandler((req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

exports.join_club_post = [
  body("code", "Incorrect code.")
    .trim()
    .matches(process.env.CLUB_CODE)
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const allMessages = await Message.find()
        .populate("sender")
        .sort({ createdAt: -1 })
        .exec();
      res.render("index", {
        user: req.user,
        messages: allMessages,
        errors: errors.array(),
      });
    } else {
      await User.findByIdAndUpdate(req.user._id, { membership_status: true });
      res.redirect("/");
    }
  }),
];
