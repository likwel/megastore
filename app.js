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

const cookieSession = require('cookie-session')

require('dotenv').config();

const server = http.createServer(app);

const sequelize = require('sequelize');

const db = require('./connexion');

// Test DB
db.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err))

const User = require('./models/users');
const Supplier = require('./models/supplier');
const Schedule = require('./models/schedule');
const Product = require('./models/product');

const usersRouter = require('./routes/usersRouter')

app.use(cookieSession({
    name: 'session',
    keys: [process.env.ACCESS_TOKEN_SECRET],
  
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }))

//routes for the equipe API
app.use('/', usersRouter)

app.get('/', (req, res) => {
    // console.log(req.cookies);
    // console.log(req.cookies.user);
    // console.log(req.cookies.token);
    let is_connected = false;
    if(req.cookies.user){
        is_connected=true
    }
    
    res.render("index", {
        "is_connected" : is_connected,
        "user": req.cookies.user,
        "token": req.cookies.token
    });
})

app.get('/profile', (req, res) => {
    res.render("profile");
})

// app.get('/cart', (req, res) => {
//     res.render("index");
// })

server.listen(port, () => {
    console.log(`Maintenant à l'écoute sur le port ${port}`);
});