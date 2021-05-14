const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  username: process.env.mongodb_username,
  password: process.env.mongodb_password,
  database: process.env.mongodb_database,
  EDITORMAX: process.env.editor_max || 500,
  ADMINMAX: process.env.admin_max || 10000,
  HOSPITALMAX: process.env.hospital_max || 5000,
  USERMAX: process.env.user_max || 1000,
};
