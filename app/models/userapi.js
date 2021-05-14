const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userApiSchema = new Schema(
  {
    _id: {
      type: Number,
    },
    api_key: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    host: {
      type: String,
      required: true,
    },
    usage: {
      type: Array,
    },
  },
  { collection: "users_api", timestamps: true }
);

const UserApi = mongoose.model("UserApi", userApiSchema);

module.exports = UserApi;
