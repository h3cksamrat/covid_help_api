const { EDITORMAX } = require("../config");
const db = require("./mongodb");
const EditorApi = require("../app/models/editorapi");
const { genKey } = require("./apikeys");

const editorApiData = (editor) => {
  EditorApi({
    _id: editor._id,
    editor_name: editor.editor_name,
    api_key: editor.api_key,
    email: editor.email,
    usage: editor.usage,
  }).save((err) => {
    if (err) {
      throw err;
    }
  });
};

const editorExists = (email, editor_name, res) => {
  EditorApi.find()
    .then((editors) => {
      if (editors != []) {
        let answer = editors.find(
          (editor) => editor.email == email || editor.editor_name == editor_name
        );
        if (answer) {
          return res.status(409).send({
            error: {
              code: 409,
              message: "Internal Conflict",
            },
          });
        } else {
          let api_key = createEditor(email, editor_name);
          return res.status(201).send({ editor_api_key: api_key });
        }
      } else {
        let api_key = createEditor((email, editor_name));
        return res.status(201).send({ editor_api_key: api_key });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const createEditor = (email, editor_name) => {
  let today = new Date().toISOString().split("T")[0];
  let editor = {
    _id: Date.now(),
    editor_name: editor_name,
    api_key: genKey(),
    email: email,
    usage: [{ date: today, count: 0 }],
  };
  console.log("added editor");
  editorApiData(editor);
  return editor.api_key;
};

const validateEditorKey = (req, res, next) => {
  EditorApi.find().then((editors) => {
    let api_key = req.headers["x-api-key"];
    if (api_key == null) {
      res.status(403).send({
        error: {
          code: 403,
          message: "You are not allowed.",
        },
      });
    } else {
      let editor_account;
      if (editors != []) {
        editor_account = editors.find((editor) => editor.api_key == api_key);
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
    }
  });
};

module.exports = {
  editorExists,
  validateEditorKey,
};
