const express = require('express');
const http = require('http');
const app = express();

const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const port = 5000;

app.use(bodyParser.json({limit: '50mb'}));
// app.use(express.json())
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser())
app.set("view engine", "ejs");
// app.engine('ejs', require('ejs').__express);
app.use(express.static(path.join(__dirname, "public")));
require('dotenv').config();

const server = http.createServer(app);

const sequelize = require('sequelize');

const db = require('./connexion');

const User = require('./models/users');
const Supplier = require('./models/supplier');
const Schedule = require('./models/schedule');
const Product = require('./models/product');

app.get('/', (req, res) => {
    res.render("index");
})

app.get('/sign-in', (req, res) => {
    res.render("login");
})

app.get('/sign-up', (req, res) => {
    res.render("register");
})
app.get('/cart', (req, res) => {
    res.render("index");
})

server.listen(port, () => {
    console.log(`Maintenant à l'écoute sur le port ${port}`);
});