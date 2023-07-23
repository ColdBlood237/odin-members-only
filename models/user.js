const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  last_name: { type: String, required: true, maxLength: 100 },
  username: { type: String, required: true, maxLength: 100 },
  password: { type: String, required: true, maxLength: 100 },
  membership_status: { type: Boolean, required: true },
});

UserSchema.virtual("full_name").get(function () {
  let fullname = "";

  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }

  return fullname;
});

module.exports = mongoose.model("User", UserSchema);
