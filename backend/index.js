const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const { connectMongo } = require("./connection/connection");
const urlRoute = require("./routes/url");
const PORT = process.env.PORT || 8001;

app.use(cors());
app.use(express.json());

connectMongo(process.env.mongoURI || "mongodb://127.0.0.1:27017/urlShortner");

app.use("/url", urlRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});