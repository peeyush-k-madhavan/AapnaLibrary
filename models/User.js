const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  headline: {
    type: String,
  },
  birthday: {
    type: Date,
  },
  status: {
    type: String,
  },
  city: {
    type: String,
  },
  district: {
    type: String,
  },
  state: {
    type: String,
  },
  pincode: {
    type: String,
  },
});

module.exports = mongoose.model("users", UserSchema);
