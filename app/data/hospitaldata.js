const db = require("../../middleware/mongodb");
const HospitalData = require("../models/hospitaldata");

const hospitalData = (id, hospital_data) => {
  HospitalData({
    _id: id,
    name_of_hospital: hospital_data.name_of_hospital,
    contact_number: hospital_data.contact_number,
    address: hospital_data.address,
    description: hospital_data.description,
    vaccine_service: hospital_data.vaccine_service,
    ventilator_service: hospital_data.ventilator_service,
    covid_patients: hospital_data.covid_patients,
    pcr_test: hospital_data.pcr_test,
    plasma: hospital_data.plasma,
    icu_beds: hospital_data.icu_beds,
    covid_beds: hospital_data.covid_beds,
    oxygen_cylinder: hospital_data.oxygen_cylinder,
    extra_services: hospital_data.extra_services,
  }).save((err) => {
    if (err) {
      throw err;
    }
  });
};

const addHospitalData = (data, res) => {
  hospitalData(Date.now(), data);
  res.status(201).send({ message: "Hospital Data Added Data" });
};

module.exports = addHospitalData;
