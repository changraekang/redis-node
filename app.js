const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { createClient } = require("redis");

const app = express();

let client; // 전역 변수로 설정

async function run() {
  client = createClient({ url: "http://localhost", port: 6379 });

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
  const { order, price } = req.body;
  console.log(req.body, ":::::::err");
  if (!order || !price) {
    return res.status(400).send("Missing parameters");
  }
  let now = new Date();
  let arrayData = [{ order: order, price: price, timesmp: now }];
  try {
    await client.lPush("mylist", arrayData);
    res.json({
      message: `Hello, ${arrayData}!`,
    });
  } catch (err) {
    console.log(err, ":::::::err");
    res.status(500).send("Error interacting with Redis");
  }
  console.log(req.body, ":::::::err");
});

app.get("/get-endpoint/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const value = await client.lRange("mylist", 0, -1);
    const num = await client.lLen("mylist");
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
