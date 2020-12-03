require("./config/config");
const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");
const _ = require("lodash");
const cors = require("cors");
const { ObjectID } = require("mongodb");
const { mongoose } = require("./db/mongoose");
const { Tasks } = require("./models/tasks");
const { User } = require("./models/user");
const { authenticate } = require("./middleware/authenticate");

const publicDirectoryPath = path.join(__dirname, "./../public");

const port = process.env.PORT;

let app = express();

app.use(express.static(publicDirectoryPath));
app.use(bodyParser.json());
app.use(cors());

app.options("*", cors());

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

app.get("/tasks/:id", (req, res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Tasks.findById(id)
    .then((task) => {
      if (!task) {
        return status(404).send();
      }
      res.send(task);
    })
    .catch((error) => res.status(400).send(error));
});

// User Endpoints

// Create User
app.post("/users", (req, res) => {
  let body = _.pick(req.body, ["email", "password"]);
  let user = new User(body);

  user
    .save() // trigger middleware
    .then(() => {
      return user.generateAuthToken();
    })
    .then((token) => {
      res.header("x-auth", token).send(user);
    })
    .catch((error) => res.status(400).send(error));
});

// Login User

app.post("/users/login", (req, res) => {
  let body = _.pick(req.body, ["email", "password"]);

  User.findByCredentials(body.email, body.password)
    .then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header("x-auth", token).send(user);
      });
    })
    .catch((error) => res.status(400).send(error));
});

// Delete

app.delete("/users/me/logout", authenticate, (req, res) => {
  req.user.removeToken(req.token).then(
    () => {
      res.status(200).send();
    },
    () => res.sendStatus(400).send()
  );
});

app.get("/", (req, res) => {
  res.sendFile(`${publicDirectoryPath}/index.html`);
});

app.listen(port, () => {
  console.log("App started on port " + port);
});
