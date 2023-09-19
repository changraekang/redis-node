const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { createClient } = require("redis");

const app = express();

let client; // 전역 변수로 설정

async function run() {
  client = createClient({ url: "redis://localhost", port: 6379 });

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
  if (!order || !price) {
    return res.status(400).send("Missing parameters");
  }
  let now = new Date().now;
  let arrayData = { order: order, price: price, timestamp: now };

  // 객체를 문자열로 직렬화
  const serializedData = JSON.stringify(arrayData);

  try {
    // 데이터를 Redis 리스트에 추가
    await client.hSet("Order-List", order, price);

    res.json({
      message: `Data inserted: ${serializedData}`,
    });
  } catch (err) {
    console.log(err, ":::::::err");
    res.status(500).send("Error interacting with Redis");
  }
});

app.get("/get-endpoint/", async (req, res) => {
  const { name } = req.params;

  try {
    const num = await client.hGetAll("Order-List");
    if (value) {
      return res.json({
        message: num,
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
