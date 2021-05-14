const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hospitalApiSchema = new Schema(
  {
    _id: {
      type: Number,
    },
    hospital_name: {
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
    host: {
      type: String,
      required: true,
    },
    usage: {
      type: Array,
    },
  },
  { timestamps: true, collection: "hospital_api" }
);

const HospitalApi = mongoose.model("HospitalApi", hospitalApiSchema);

module.exports = HospitalApi;
