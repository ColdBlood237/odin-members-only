const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

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
      username: req.body.email,
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
        res.redirect("/");
      }
    }
  }),
];

exports.user_login_get = asyncHandler((req, res, next) => {
  res.render("log-in-form");
});

exports.user_login_post = asyncHandler((req, res, next) => {
  res.send("NOT IMPLEMENTED YET: user login POST");
});
