const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const editorApiSchema = new Schema(
  {
    _id: {
      type: Number,
    },
    editor_name: {
      type: String,
      required: true,
    },
    api_key: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    usage: {
      type: Array,
    },
  },
  { timestamps: true, collection: "editor_api" }
);

const EditorApi = mongoose.model("EditorApi", editorApiSchema);

module.exports = EditorApi;
