const { ADMINMAX } = require("../config");
const db = require("./mongodb");
const AdminApi = require("../app/models/adminapi");
const { genKey } = require("./apikeys");

const adminApiData = (admin) => {
  AdminApi({
    _id: admin._id,
    admin_name: admin.admin_name,
    api_key: admin.api_key,
    email: admin.email,
    usage: admin.usage,
  }).save((err) => {
    if (err) {
      throw err;
    }
  });
};

const adminExists = (email, admin_name, res) => {
  AdminApi.find()
    .then((admins) => {
      if (admins != []) {
        let answer = admins.find(
          (admin) => admin.email == email || admin.admin_name == admin_name
        );
        if (answer) {
          return res.status(409).send({
            error: {
              code: 409,
              message: "Internal Conflict",
            },
          });
        } else {
          let api_key = createAdmin(email, admin_name);
          return res.status(201).send({ admin_api_key: api_key });
        }
      } else {
        let api_key = createAdmin((email, admin_name));
        return res.status(201).send({ admin_api_key: api_key });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const createAdmin = (email, admin_name) => {
  let today = new Date().toISOString().split("T")[0];
  let admin = {
    _id: Date.now(),
    admin_name: admin_name,
    api_key: genKey(),
    email: email,
    usage: [{ date: today, count: 0 }],
  };
  console.log("added admin");
  adminApiData(admin);
  return admin.api_key;
};

const validateAdminKey = (req, res, next) => {
  AdminApi.find().then((admins) => {
    let api_key = req.headers["x-api-key"];
    if (api_key == null) {
      res.status(403).send({
        error: {
          code: 403,
          message: "You are not allowed.",
        },
      });
    } else {
      let admin_account;
      if (admins != []) {
        admin_account = admins.find((admin) => admin.api_key == api_key);
      } else {
        admin_account = false;
      }

      if (admin_account) {
        let today = new Date().toISOString().split("T")[0];
        let usageIndex = admin_account.usage.findIndex(
          (day) => day.date == today
        );
        if (usageIndex >= 0) {
          admin_account.usage[usageIndex].count++;
          AdminApi.findOneAndUpdate(
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
          admin_account.usage.push({ date: today, count: 1 });
          AdminApi.findOneAndUpdate(
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
  adminExists,
  validateAdminKey,
};
