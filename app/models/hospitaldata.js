const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hospitalDataSchema = new Schema(
  {
    _id: {
      type: Number,
    },
    name_of_hospital: {
      type: String,
    },
    contact_number: {
      type: Array,
    },
    address: {
      type: String,
    },
    description: {
      type: String,
    },
    vaccine_service: {
      available: {
        type: Boolean,
      },
    },
    ventilator_service: {
      avaiable: {
        type: Boolean,
      },
      total_quantity: {
        type: Number,
      },
      currently_available: {
        type: Number,
      },
    },
    covid_patients: {
      active: {
        type: Number,
      },
      dead: {
        type: Number,
      },
      recovered: {
        type: Number,
      },
    },
    pcr_test: {
      available: {
        type: Boolean,
      },
    },
    plasma: {
      needed: {
        type: Boolean,
      },
    },
    icu_beds: {
      total: {
        type: Number,
      },
      available: {
        type: Number,
      },
    },
    covid_beds: {
      total: {
        type: Number,
      },
      available: {
        type: Number,
      },
    },
    oxygen_cylinder: {
      full: {
        type: Number,
      },
      empty: {
        type: Number,
      },
    },
    extra_services: {
      type: Array,
    },
  },
  { collection: "hospital_data", timestamps: true }
);
const HospitalData = mongoose.model("HospitalData", hospitalDataSchema);

module.exports = HospitalData;
