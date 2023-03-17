const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(express.json());
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
let username_exists = true;
let email_exists = true;

app.use(express.static("/public"));

app.use(bodyParser.urlencoded({ extended: true }));

//making a localhost on port 3001
app.listen(3001, function () {
    console.log("Server started on port 3001");
});

// open the database connection
let db = new sqlite3.Database('database.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the mydatabase database.');
  });

//send file to the frontend

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/login.html");
});

//taking the data from the frontend

app.post('/submit-data', function(req, res) {
    let username = req.body.username;
    let email = req.body.email;
    let password0 = req.body.password;
    let password = bcrypt.hashSync(password0, salt);
    //let query = `SELECT * FROM users WHERE username = '${username}'`;
    let checkValue = username;
    let checkValue2 = email;

    let query = `SELECT username FROM users WHERE username = ?`;
    let query2 = `SELECT email FROM users WHERE email = ?`;

    db.get(query, [checkValue], (err, row) => {
    if (err) {
        console.error(err.message);
    } else if (row) {
        console.log(`${checkValue} is in the database.`);

    } else {
        console.log(`${checkValue} is not in the database.`);
        username_exists = false;
    }
});
db.get(query2, [checkValue2], (err, row) => {
    if (err) {
        console.error(err.message);
    } else if (row) {
        console.log(`${checkValue2} is in the database.`);
    } else {
        console.log(`${checkValue2} is not in the database.`);
        email_exists = false;
    }
});
    if (username_exists == false && email_exists == false) {
        console.log('it created a user');
        db.run(`INSERT INTO users (username, email, password) VALUES ('${username}', '${email}', '${password}')`);
    }
});