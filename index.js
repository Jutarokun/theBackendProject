const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(express.json());
const sqlite3 = require('sqlite3').verbose();

app.use(express.static('staticFiles'));

app.listen(3001, function () {
    console.log("Server started on port 3001");
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/html/index.html");
});