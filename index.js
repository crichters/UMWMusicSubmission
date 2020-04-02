const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set("port", 3000);

app.use(bodyParser.json({type: "application/json"}));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {

});

//This is a get request that simply returns the login page
app.get("/login-page", (req, res) => {

});

//This get request is used to actually sign the user in.
app.get("/login", (req, res) => {

});

app.get("/form", (req, res) => {

});

app.post("/form", (req, res) => {

});

app.get("/create-recital", (req, res) => {

});

app.post("/create-recital", (req, res) => {

});

app.post("/change-email", (req, res) => {

});

app.post("/change-password", (req, res) => {

});

app.get("/logout", (req, res) => {

});

app.post



app.listen(process.env.PORT || app.get("port"), process.env.IP, (req, res) => {
    console.log("Server started");
});