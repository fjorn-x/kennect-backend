const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = mongoose.Schema(
  {
    name: {type: String, required: [true, "Please add a name"]},
    email: {
      type: String,
      required: [true, "Please add an email"],
      lowercase: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new ErrorHandler(400, "Invalid email");
        }
      },
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new ErrorHandler(400, "Password must contain at least one letter and one number");
        }
      },
    },
  },
  {timestamps: true}
);
module.exports = mongoose.model("User", UserSchema);
