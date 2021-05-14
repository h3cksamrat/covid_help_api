const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const helplineDataSchema = new Schema(
  {
    oxygen_helpline: [
      {
        name: {
          type: String,
        },
        contact_number: {
          type: Array,
        },
        addresses: {
          type: Array,
        },
      },
    ],
    ambulance_helpline: [
      {
        name: {
          type: String,
        },
        contact_number: {
          type: Array,
        },
        address: {
          type: Array,
        },
      },
    ],
    blood_helpline: [
      {
        name: {
          type: String,
        },
        contact_number: {
          type: Array,
        },
        address: {
          type: Array,
        },
      },
    ],
  },
  { collection: "helpline_data", timestamps: true }
);
const HelplineData = mongoose.model("HelplineData", helplineDataSchema);

module.exports = HelplineData;
