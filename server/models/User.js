const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      required: true,
      enum: ['local', 'google']
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: function () {
        return this.method === 'local';
      }
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return this.method === 'local';
      }
    },
    googleId: {
      type: String,
      required: function () {
        return this.method === 'google';
      }
    },
    profileImagePath: {
      type: String,
      default: "",
    },
    tripList: {
      type: Array,
      default: [],
    },
    wishList: {
      type: Array,
      default: [],
    },
    propertyList: {
      type: Array,
      default: [],
    },
    reservationList: {
      type: Array,
      default: [],
    },
    verificationCode: {
      type: String,
      default: ""
    },
    codeExpiry: {
      type: Date
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;

