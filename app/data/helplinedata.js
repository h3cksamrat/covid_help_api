const db = require("../../middleware/mongodb");
const HelplineData = require("../models/helplinedata");

const addtoarray = (readyArray, comingValue) => {
  return readyArray.push(comingValue);
};

const addHelplineData = (reqData, res) => {
  HelplineData.find().then((data) => {
    if (data == []) {
      HelplineData({
        _id: 123_456_789,
        oxygen_helpline: [],
        ambulance_helpline: [],
        blood_helpline: [],
      }).save((err) => {
        if (err) {
          throw err;
        }
      });
    }

    oxygen_helpline = reqData.oxygen_helpline.reduce(
      addtoarray,
      data.oxygen_helpline
    );
    ambulance_helpline = reqData.ambulance_helpline.reduce(
      addtoarray,
      data.ambulance_helpline
    );
    blood_helpline = reqData.blood_helpline.reduce(
      addtoarray,
      data.blood_helpline
    );

    HelplineData.findOneAndUpdate(
      { _id: 123_456_789 },
      {
        oxygen_helpline: oxygen_helpline,
        ambulance_helpline: ambulance_helpline,
        blood_helpline: blood_helpline,
      },
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
  });

  res.status(201).send({ message: "Helpline Added" });
};

module.exports = addHelplineData;
