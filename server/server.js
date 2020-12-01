require("./config/config");
const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");
const { mongoose } = require("./db/mongoose");
const { Tasks } = require("./models/tasks");

const publicDirectoryPath = path.join(__dirname, "./../public");

const port = process.env.PORT;

let app = express();

app.use(express.static(publicDirectoryPath));
app.use(bodyParser.json());

app.get("/tasks", (req, res) => {
  Tasks.find().then(
    (allTasks) => {
      res.send(allTasks);
    },
    (error) => {
      res.status(400).send(error);
    }
  );
});

app.get("/", (req, res) => {
  res.sendFile(`${publicDirectoryPath}/index.html`);
});

app.listen(port, () => {
  console.log("App started on port " + port);
});
