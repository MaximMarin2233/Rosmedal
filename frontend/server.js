var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var port = 3003;
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "dist")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get("*", function (request, response) {
    response.sendFile(path.join(__dirname, "dist", "index.html"));
});
app.listen(port, function () {
    console.log("Server is running");
});
