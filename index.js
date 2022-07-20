const express = require("express");
const Sequelize = require("sequelize");
const { corswm } = require("./middelwares/corsmw");
const jwt = require("express-jwt");
const { corsmw } = require("./middelwares/corsmw");
require("custom-env").env(true);
const app = express();
const port = 5555;

const publicRoutes = [/\/auth\/*/, "/user/register"];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  jwt({
    secret: process.env.JWT,
    algorithms: ["HS256"],
    resultProperty: "locals.decoded.user",
  }).unless({ path: publicRoutes })
);

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.header("Access-Control-Allow-Origin", "*");
    res.status(401).send({
      status: 401,
      errorCode: "TOKEN_EXPIRED",
      error: "Unauthorized",
    });
  } else {
    next(err);
  }
});

app.use("/", corsmw, require("./api"));
if (process.env.NODE_ENV == "test") {
  app.listen(port, () => {
    console.log(`Server listening on \nURL -> http://localhost:${port}`);
  });
} else {
  app.listen();
}
