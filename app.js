const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { createClient } = require("redis"); // Redis 라이브러리를 불러옵니다.

const app = express();

// Redis 클라이언트를 생성합니다.

const client = createClient();

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.post("/post-endpoint", async (req, res) => {
  const { name, age } = req.body;
  await client.set(name, age);
  if (!name || !age) {
    return res.status(400).send("Missing parameters");
  }

  // Redis에 데이터를 저장합니다.

  res.json({
    message: `Hello, ${name}! You are ${age} years old.`,
  });
});

app.get("/get-endpoint/:name", async (req, res) => {
  const { name } = req.params;
  const value = await client.get(name);
  // Redis에서 데이터를 가져옵니다.
  return res.json({
    message: `Hello, ${name}! You are ${value} years old.`,
  });
});

const PORT = 5000;
const HOST = "0.0.0.0";
app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
