const app = require("express")();
const db = require("./config/db");
const consign = require("consign");

consign()
  .then("./config/middlewares.js")
  .then("./api")
  .then("./config/rotas.js")
  .into(app);

app.db = db;

app.listen(3000, () => console.log("Backend executado!"));
