const { HOSPITALMAX } = require("../config");
const db = require("./mongodb");
const HospitalApi = require("../app/models/hospitalapi");
const { genKey } = require("./apikeys");

const hospitalApiData = (hospitalUser) => {
  HospitalApi({
    _id: hospitalUser._id,
    hospital_name: hospitalUser.hospital_name,
    api_key: hospitalUser.api_key,
    email: hospitalUser.email,
    host: hospitalUser.host,
    usage: hospitalUser.usage,
  }).save((err) => {
    if (err) {
      throw err;
    }
  });
};

const hospitalExists = (email, hospital_name, host, res) => {
  HospitalApi.find()
    .then((hospitals) => {
      if (hospitals != []) {
        let answer = hospitals.find(
          (hospital) =>
            hospital.email == email ||
            hospital.hospital_name == hospital_name ||
            hospital.host == host
        );
        if (answer) {
          return res.status(409).send({
            error: {
              code: 409,
              message: "Internal Conflict",
            },
          });
        } else {
          let api_key = createHospital(email, hospital_name, host);
          return res.status(201).send({ hospital_api_key: api_key });
        }
      } else {
        let api_key = createHospital((email, hospital_name, host));
        return res.status(201).send({ hospital_api_key: api_key });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const createHospital = (email, hospital_name, host) => {
  let today = new Date().toISOString().split("T")[0];
  let hospital = {
    _id: Date.now(),
    hospital_name: hospital_name,
    api_key: genKey(),
    email: email,
    host: host,
    usage: [{ date: today, count: 0 }],
  };
  console.log("added hospital");
  hospitalApiData(hospital);
  return hospital.api_key;
};

const validateHospitalKey = (req, res, next) => {
  HospitalApi.find().then((hospitals) => {
    let host = req.headers.origin;
    let api_key = req.headers["x-api-key"];
    let hospital_name = req.headers["x-hospital"];
    if (host == null || api_key == null || hospital_name == null) {
      res.status(403).send({
        error: {
          code: 403,
          message: "You are not allowed.",
        },
      });
    } else {
      let account;
      if (hospitals != []) {
        account = hospitals.find((hospital) => {
          return (
            hospital.host == host &&
            hospital.api_key == api_key &&
            hospital.hospital_name == hospital_name
          );
        });
      } else {
        account = false;
      }

      if (account) {
        let today = new Date().toISOString().split("T")[0];
        let usageIndex = account.usage.findIndex((day) => day.date == today);
        if (usageIndex >= 0) {
          account.usage[usageIndex].count++;
          HospitalApi.findOneAndUpdate(
            { api_key: api_key },
            { usage: admin_account.usage },
            {
              returnOriginal: false,
              useFindAndModify: false,
            },
            (err) => {
              if (err) {
                console.log("Something wrong when updating data!");
              }
            }
          );
          next();
        } else {
          account.usage.push({ date: today, count: 1 });
          HospitalApi.findOneAndUpdate(
            { api_key: api_key },
            { usage: admin_account.usage },
            {
              returnOriginal: false,
              useFindAndModify: false,
            },
            (err) => {
              if (err) {
                console.log("Something wrong when updating data!");
              }
            }
          );
          next();
        }
      } else {
        res.status(403).send({
          error: {
            code: 403,
            message: "You are not allowed.",
          },
        });
      }
    }
  });
};

module.exports = {
  validateHospitalKey,
  hospitalExists,
};
