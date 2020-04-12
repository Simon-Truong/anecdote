require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const cors = require("cors");

// routes
const users = require("./routes/users");

// middle ware
app.use(express.json());
app.use(cors());

app.use("/api", users);

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
