const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminApiSchema = new Schema(
  {
    _id: {
      type: Number,
    },
    admin_name: {
      type: String,
      required: true,
    },
    api_key: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    usage: {
      type: Array,
    },
  },
  { timestamps: true, collection: "admin_api" }
);

const AdminApi = mongoose.model("AdminApi", adminApiSchema);

module.exports = AdminApi;
