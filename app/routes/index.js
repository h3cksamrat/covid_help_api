const { userExists } = require("../../middleware/user_apikeys.js");
const { hospitalExists } = require("../../middleware/hospital_apikeys");
const { editorExists } = require("../../middleware/editorapikeys");
const {
  adminExists,
  validateAdminKey,
} = require("../../middleware/adminapikeys");
const {
  validateEitherKey,
  validateOtherThanUser,
  validateAdminOrEditor,
} = require("../../middleware/apikeys");
const HospitalData = require("../models/hospitaldata");
const HelplineData = require("../models/helplinedata.js");
const addHospitalData = require("../data/hospitaldata");
const addHelplineData = require("../data/helplinedata.js");

module.exports = (app, cors) => {
  app.get("/", (req, res) => {
    res.status(200).render("index");
  });

  app.post("/createuserapikey", (req, res) => {
    let email = req.body.email;
    let domain = req.body.domain;
    userExists(email, domain, res);
  });

  app.post("/createadminapikey", validateAdminKey, (req, res) => {
    let email = req.body.email;
    let admin_name = req.body.admin_name;
    adminExists(email, admin_name, res);
  });

  app.post("/createeditorapikey", validateAdminKey, (req, res) => {
    let email = req.body.email;
    let editor_name = req.body.editor_name;
    editorExists(email, editor_name, res);
  });

  app.post("/createhospitalapikey", validateAdminOrEditor, (req, res) => {
    let email = req.body.email;
    let domain = req.body.domain;
    let hospital_name = req.body.hospital_name;
    hospitalExists(email, hospital_name, domain, res);
  });

  app.post("/addhospitaldata", cors(), validateOtherThanUser, (req, res) => {
    addHospitalData(req.body, res);
  });

  app.post("/addhelplinedata", cors(), validateOtherThanUser, (req, res) => {
    addHelplineData(req.body, res);
  });

  app.get("/gethospitaldata", cors(), validateEitherKey, (req, res) => {
    HospitalData.find()
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  app.get("/gethelplinedata", cors(), validateEitherKey, (req, res) => {
    HelplineData.find()
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  app.get("*", (req, res) => {
    res.status(404).send("Page Not Found");
  });

  app.all("*", (req, res) => {
    res.status(405).send("Method not defined");
  });
};
