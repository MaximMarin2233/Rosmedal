const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const port = 3003;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "dist")));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("*", (request, response) => {
  response.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log("Server is running");
});
