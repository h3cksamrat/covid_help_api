const mongoose = require("mongoose");
const { password, database, username } = require("../config");

const url = `mongodb+srv://${username}:${password}@cluster0.78jd0.mongodb.net/${database}?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("connected", function () {
  console.log("database is connected successfully");
});
db.on("disconnected", function () {
  console.log("database is disconnected successfully");
});
db.on("error", console.error.bind(console, "connection error:"));

module.exports = db;
