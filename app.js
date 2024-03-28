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
const vendorRouter = require('./routes/suppliersRouter')
const productRouter = require('./routes/productsRouter')


app.use(cookieSession({
    name: 'session',
    keys: [process.env.ACCESS_TOKEN_SECRET],
  
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }))

//routes for the equipe API
app.use('/', usersRouter)
app.use('/', vendorRouter)

app.get('/', async (req, res) => {
    // console.log(req.cookies);
    // console.log(req.cookies.user);
    // console.log(req.cookies.token);
    let is_connected = false;
    if(req.cookies.user){
        is_connected=true
    }

    let all_supp = await Supplier.findAll({
        include: [{
          model: Product
         }]
      })


    // console.log(all_supp);
    
    res.render("index", {
        "is_connected" : is_connected,
        "user": req.cookies.user,
        "token": req.cookies.token,
        "all_vendor" : all_supp,
    });
})

app.get('/my-account', (req, res) => {

    // console.log(req.cookies);

    let is_connected = false;
    if(req.cookies.user){
        is_connected=true
        res.render("profile", {
            "is_connected" : is_connected,
            "user": req.cookies.user,
            "vendor": req.cookies.vendor,
            "token": req.cookies.token
        });
    }else{
        res.redirect("/login")
    }
    
    
})

app.get('/vendor/:url', (req, res) => {

    let is_connected = false;
    if(req.cookies.user){
        is_connected=true
    }
    
    res.render("vendor", {
        "is_connected" : is_connected,
        "user": req.cookies.user,
        "vendor": req.cookies.vendor,
        "token": req.cookies.token
    });
})
app.get('/my-account/settings', (req, res) => {

    let is_connected = false;
    if(req.cookies.user){
        is_connected=true
    }
    
    res.render("settings", {
        "is_connected" : is_connected,
        "user": req.cookies.user,
        "vendor": req.cookies.vendor,
        "token": req.cookies.token
    });
})

app.get('/my-account/setting-advanced', (req, res) => {

    let is_connected = false;
    if(req.cookies.user){
        is_connected=true
    }
    
    res.render("settings-advanced", {
        "is_connected" : is_connected,
        "user": req.cookies.user,
        "vendor": req.cookies.vendor,
        "token": req.cookies.token
    });
})

app.get('/my-account/security', (req, res) => {

    let is_connected = false;
    if(req.cookies.user){
        is_connected=true
    }
    
    res.render("security", {
        "is_connected" : is_connected,
        "user": req.cookies.user,
        "vendor": req.cookies.vendor,
        "token": req.cookies.token
    });
})

app.get('/my-account/products', (req, res) => {

    let is_connected = false;
    if(req.cookies.user){
        is_connected=true
    }
    
    res.render("products", {
        "is_connected" : is_connected,
        "vendor": req.cookies.vendor,
        "user": req.cookies.user,
        "token": req.cookies.token
    });
})

app.get('/:username', async (req, res) => {

    let username = req.params.username

    //find a user by their email
    // const user = await User.findOne({
    //     where: {
    //         username: username
    //     }

    // });

    //find a supplier by their email
    const supplier = await Supplier.findOne({
        where: {
            company_url: username
        }

    });

    if(supplier){

        let is_connected = false;

        if(req.cookies.user){
            is_connected=true
        }

        res.render("shop/basic", {
            "is_connected" : is_connected,
            "vendor": req.cookies.vendor,
            "user": req.cookies.user,
            "token": req.cookies.token
        });
    }else{
        res.redirect("/")
    }

    
})

app.get('/shop', (req, res) => {
    res.render("index");
})

app.get('/page/faq', (req, res) => {

    let is_connected = false;
    if(req.cookies.user){
        is_connected=true
    }
    
    res.render("faq", {
        "is_connected" : is_connected,
        "user": req.cookies.user,
        "vendor": req.cookies.vendor,
        "token": req.cookies.token
    });

})

app.get('/page/pricing', (req, res) => {

    let is_connected = false;
    if(req.cookies.user){
        is_connected=true
    }
    
    res.render("pricing", {
        "is_connected" : is_connected,
        "user": req.cookies.user,
        "vendor": req.cookies.vendor,
        "token": req.cookies.token
    });

})

// app.get('/cart', (req, res) => {
//     res.render("index");
// })

server.listen(port, () => {
    console.log(`Maintenant à l'écoute sur le port ${port}`);
});