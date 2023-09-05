const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const redis = require("redis"); // Redis 라이브러리를 불러옵니다.

const app = express();

// Redis 클라이언트를 생성합니다.
const client = redis.createClient();

client.on("error", function (error) {
  console.error(error);
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.post("/post-endpoint", (req, res) => {
  const { name, age } = req.body;

  if (!name || !age) {
    return res.status(400).send("Missing parameters");
  }

  // Redis에 데이터를 저장합니다.
  client.set(`user:${name}`, age);

  res.json({
    message: `Hello, ${name}! You are ${age} years old.`,
  });
});

app.get("/get-endpoint/:name", (req, res) => {
  const { name } = req.params;

  // Redis에서 데이터를 가져옵니다.
  client.get(`user:${name}`, (err, reply) => {
    if (err) {
      return res.status(500).send(err.toString());
    }

    if (reply) {
      return res.json({
        message: `Hello, ${name}! You are ${reply} years old.`,
      });
    } else {
      return res.status(404).send("Not found");
    }
  });
});

const PORT = 5000;
const HOST = "0.0.0.0";
app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
