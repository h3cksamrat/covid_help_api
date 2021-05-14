const express = require("express");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("static"), express.json(), (req, res, next) => {
  res.removeHeader("x-powered-by");
  next();
});

require("./app/routes")(app, cors);

app.listen(port, () => {
  console.log(`We are live on ${port}`);
});
