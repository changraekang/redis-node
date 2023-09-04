const express = require("express");
const bodyParser = require("body-parser");

const cors = require("cors"); // CORS 패키지를 불러옵니다.

const app = express();

// CORS 미들웨어를 사용합니다.
app.use(cors());

// Use body-parser middleware to handle POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handle GET request at root
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Handle POST request at /post-endpoint
app.post("/post-endpoint", (req, res) => {
  // Access POST data with req.body
  const { name, age } = req.body;

  if (!name || !age) {
    return res.status(400).send("Missing parameters");
  }

  // Do something with the data (e.g., save to database, etc.)

  // Send a response
  res.json({
    message: `Hello, ${name}! You are ${age} years old.`,
  });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
