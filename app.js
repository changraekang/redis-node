const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { createClient } = require("redis");

const app = express();

let client; // 전역 변수로 설정

async function run() {
  client = createClient();

  client.on("error", (err) => console.log("Redis Client Error", err));

  try {
    await client.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Could not connect to Redis:", err);
  }
}

run();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.post("/post-endpoint", async (req, res) => {
  const { name, age } = req.body;
  console.log(name, age, ":::::::test");
  if (!name || !age) {
    return res.status(400).send("Missing parameters");
  }

  try {
    await client.lpush("name", name);
    res.json({
      message: `Hello, ${name}!`,
    });
  } catch (err) {
    res.status(500).send("Error interacting with Redis");
  }
});

app.get("/get-endpoint/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const value = await client.lrange("name", 0, -1);
    const num = await client.llen("name");
    if (value) {
      return res.json({
        message: `Hello, ${value}! name number is ${num}.`,
      });
    } else {
      return res.status(404).send("Name not found in Redis");
    }
  } catch (err) {
    res.status(500).send("Error interacting with Redis");
  }
});

const PORT = 5000;
const HOST = "0.0.0.0";
app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
