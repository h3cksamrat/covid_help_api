const { EDITORMAX, ADMINMAX, HOSPITALMAX, USERMAX } = require("../config");
const UserApi = require("../app/models/userapi");
const HospitalApi = require("../app/models/hospitalapi");
const EditorApi = require("../app/models/editorapi");
const AdminApi = require("../app/models/adminapi");

const genKey = () => {
  return [...Array(30)]
    .map((e) => ((Math.random() * 36) | 0).toString(36))
    .join("");
};

const validateEitherKey = (req, res, next) => {
  let host = req.headers.origin;
  let api_key = req.headers["x-api-key"];
  let hospital_name = req.headers["x-hospital"];
  if (api_key == null) {
    res.status(403).send({
      error: {
        code: 403,
        message: "You are not allowed.",
      },
    });
  } else {
    AdminApi.find().then((admins) => {
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
        HospitalApi.find().then((hospitals) => {
          let hospital_acount;
          if (hospitals != []) {
            hospital_account = hospitals.find((hospital) => {
              return (
                hospital.host == host &&
                hospital.api_key == api_key &&
                hospital.hospital_name == hospital_name
              );
            });
          } else {
            hospital_acount = false;
          }

          if (hospital_account) {
            let today = new Date().toISOString().split("T")[0];
            let usageIndex = hospital_account.usage.findIndex(
              (day) => day.date == today
            );
            if (usageIndex >= 0) {
              hospital_account.usage[usageIndex].count++;
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
              hospital_account.usage.push({ date: today, count: 1 });
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
            UserApi.find().then((users) => {
              let user_account;
              if (users != []) {
                user_account = users.find((user) => {
                  return user.host == host && user.api_key == api_key;
                });
              } else {
                user_account = false;
              }

              if (user_account) {
                let today = new Date().toISOString().split("T")[0];
                let usageIndex = user_account.usage.findIndex(
                  (day) => day.date == today
                );
                if (usageIndex >= 0) {
                  if (user_account.usage[usageIndex].count >= USERMAX) {
                    res.status(429).send({
                      error: {
                        code: 429,
                        message: "Max API calls exceeded",
                      },
                    });
                  } else {
                    user_account.usage[usageIndex].count++;
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
                  user_account.usage.push({ date: today, count: 1 });
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
                EditorApi.find().then((editors) => {
                  let editor_account;
                  if (editors != []) {
                    editor_account = editors.find(
                      (editor) => editor.api_key == api_key
                    );
                  } else {
                    editor_account = false;
                  }

                  if (editor_account) {
                    let today = new Date().toISOString().split("T")[0];
                    let usageIndex = editor_account.usage.findIndex(
                      (day) => day.date == today
                    );
                    if (usageIndex >= 0) {
                      if (editor_account.usage[usageIndex].count >= EDITORMAX) {
                        res.status(429).send({
                          error: {
                            code: 429,
                            message: "Max API calls exceeded",
                          },
                        });
                      } else {
                        editor_account.usage[usageIndex].count++;
                        EditorApi.findOneAndUpdate(
                          { api_key: api_key },
                          { usage: admin_account.usage },
                          {
                            returnOriginal: false,
                            useFindAndModify: false,
                          },
                          (err) => {
                            if (err) {
                              console.log(
                                "Something wrong when updating data!"
                              );
                            }
                          }
                        );
                        next();
                      }
                    } else {
                      editor_account.usage.push({ date: today, count: 1 });
                      EditorApi.findOneAndUpdate(
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
                });
              }
            });
          }
        });
      }
    });
  }
};

const validateOtherThanUser = (req, res, next) => {
  let host = req.headers.origin;
  let api_key = req.headers["x-api-key"];
  let hospital_name = req.headers["x-hospital"];
  if (api_key == null) {
    res.status(403).send({
      error: {
        code: 403,
        message: "You are not allowed.",
      },
    });
  } else {
    AdminApi.find().then((admins) => {
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
        HospitalApi.find().then((hospitals) => {
          let hospital_acount;
          if (hospitals != []) {
            hospital_account = hospitals.find((hospital) => {
              return (
                hospital.host == host &&
                hospital.api_key == api_key &&
                hospital.hospital_name == hospital_name
              );
            });
          } else {
            hospital_acount = false;
          }

          if (hospital_account) {
            let today = new Date().toISOString().split("T")[0];
            let usageIndex = hospital_account.usage.findIndex(
              (day) => day.date == today
            );
            if (usageIndex >= 0) {
              hospital_account.usage[usageIndex].count++;
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
              hospital_account.usage.push({ date: today, count: 1 });
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
            EditorApi.find().then((editors) => {
              let editor_account;
              if (editors != []) {
                editor_account = editors.find(
                  (editor) => editor.api_key == api_key
                );
              } else {
                editor_account = false;
              }

              if (editor_account) {
                let today = new Date().toISOString().split("T")[0];
                let usageIndex = editor_account.usage.findIndex(
                  (day) => day.date == today
                );
                if (usageIndex >= 0) {
                  if (editor_account.usage[usageIndex].count >= EDITORMAX) {
                    res.status(429).send({
                      error: {
                        code: 429,
                        message: "Max API calls exceeded",
                      },
                    });
                  } else {
                    editor_account.usage[usageIndex].count++;
                    EditorApi.findOneAndUpdate(
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
                  editor_account.usage.push({ date: today, count: 1 });
                  EditorApi.findOneAndUpdate(
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
            });
          }
        });
      }
    });
  }
};

const validateAdminOrEditor = (req, res, next) => {
  let api_key = req.headers["x-api-key"];
  if (api_key == null) {
    res.status(403).send({
      error: {
        code: 403,
        message: "You are not allowed.",
      },
    });
  } else {
    AdminApi.find().then((admins) => {
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
        EditorApi.find().then((editors) => {
          let editor_account;
          if (editors != []) {
            editor_account = editors.find(
              (editor) => editor.api_key == api_key
            );
          } else {
            editor_account = false;
          }

          if (editor_account) {
            let today = new Date().toISOString().split("T")[0];
            let usageIndex = editor_account.usage.findIndex(
              (day) => day.date == today
            );
            if (usageIndex >= 0) {
              if (editor_account.usage[usageIndex].count >= EDITORMAX) {
                res.status(429).send({
                  error: {
                    code: 429,
                    message: "Max API calls exceeded",
                  },
                });
              } else {
                editor_account.usage[usageIndex].count++;
                EditorApi.findOneAndUpdate(
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
              editor_account.usage.push({ date: today, count: 1 });
              EditorApi.findOneAndUpdate(
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
        });
      }
    });
  }
};

module.exports = {
  genKey,
  validateEitherKey,
  validateOtherThanUser,
  validateAdminOrEditor,
};
