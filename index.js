require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// routes
const users = require("./routes/users");

// body-parser middle ware
app.use(express.json());

app.use("/api", users);

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
