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

const Op = sequelize.Op;

const db = require('./connexion');

// Test DB
db.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err))

const User = require('./models/users');
const Supplier = require('./models/supplier');
const Schedule = require('./models/schedule');
const Product = require('./models/product');
const Ads = require('./models/ads');

const usersRouter = require('./routes/usersRouter')
const vendorRouter = require('./routes/suppliersRouter')
const productRouter = require('./routes/productsRouter');
const pageRouter = require('./routes/pagesRouter');
const { log } = require('console');


app.use(cookieSession({
    name: 'session',
    keys: [process.env.ACCESS_TOKEN_SECRET],
  
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }))

//routes for the equipe API
app.use('/', usersRouter)
app.use('/', vendorRouter)
app.use('/', productRouter)
app.use('/', pageRouter)

app.get('/', async (req, res) => {

    let is_connected = false;
    if(req.cookies.user){
        is_connected=true
    }

    let all_supp = await Supplier.findAll({
        include: [{
          model: Product
         }]
      })
    
    let page = (req.query.page && req.query.page > 0 )?req.query.page:1;

    const limit = 6; // Nombre de produits par page

    // Calculer l'offset en fonction de la page actuelle
    const offset = (page - 1) * limit;

    let all_vendor_limit = await Supplier.findAll({
        include: [{
            model: Product
           }],
        offset: offset,
        limit: limit,
    });
    
    const maxPage = Math.ceil(all_supp.length/limit);
    
    res.render("index", {
        "is_connected" : is_connected,
        "user": req.cookies.user,
        "token": req.cookies.token,
        "all_vendor" : all_supp,
        "all_vendor_limit" : all_vendor_limit,
        "currentPage" : page,
        "page_max" : maxPage,
    });
})


server.listen(port, () => {
    console.log(`Maintenant à l'écoute sur le port ${port}`);
});