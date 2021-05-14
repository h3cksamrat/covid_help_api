const { USERMAX } = require("../config");
const db = require("./mongodb");
const UserApi = require("../app/models/userapi");
const { genKey } = require("./apikeys");

const userApiData = (user) => {
  UserApi({
    _id: user._id,
    api_key: user.api_key,
    email: user.email,
    host: user.host,
    usage: user.usage,
  }).save((err) => {
    if (err) {
      throw err;
    }
  });
};

const userExists = (_email, host, res) => {
  UserApi.find()
    .then((users) => {
      if (users != []) {
        let answer = users.find(
          (user) => user.email == _email || user.host == host
        );
        if (answer) {
          return res.status(409).send({
            error: {
              code: 409,
              message: "Internal Conflict",
            },
          });
        } else {
          let api_key = createUser(_email, host);
          return res.status(201).send({ api_key: api_key });
        }
      } else {
        let api_key = createUser(_email, host);
        return res.status(201).send({ api_key: api_key });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const createUser = (_email, domain) => {
  let today = new Date().toISOString().split("T")[0];
  let user = {
    _id: Date.now(),
    api_key: genKey(),
    email: _email,
    host: domain,
    usage: [{ date: today, count: 0 }],
  };
  console.log("added user");
  userApiData(user);
  return user.api_key;
};

const validateUserKey = (req, res, next) => {
  UserApi.find().then((users) => {
    let host = req.headers.origin;
    let api_key = req.headers["x-api-key"];
    if (host == null || api_key == null) {
      res.status(403).send({
        error: {
          code: 403,
          message: "You are not allowed.",
        },
      });
    } else {
      let account;
      if (users != []) {
        account = users.find((user) => {
          return user.host == host && user.api_key == api_key;
        });
      } else {
        account = false;
      }

      if (account) {
        let today = new Date().toISOString().split("T")[0];
        let usageIndex = account.usage.findIndex((day) => day.date == today);
        if (usageIndex >= 0) {
          if (account.usage[usageIndex].count >= USERMAX) {
            res.status(429).send({
              error: {
                code: 429,
                message: "Max API calls exceeded",
              },
            });
          } else {
            account.usage[usageIndex].count++;
            UserApi.findOneAndUpdate(
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
          account.usage.push({ date: today, count: 1 });
          UserApi.findOneAndUpdate(
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
  validateUserKey,
  userExists,
};
