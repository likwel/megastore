const express = require('express');
const http = require('http');
const app = express();

const path = require('path');
const url = require('url');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const geoip = require('geoip-lite');

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

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('IP de l\'utilisateur:', ip);

    // const ip = 'adresse_ip_du_visiteur'; // Remplacez par l'adresse IP du visiteur

    // const geo = geoip.lookup(ip);
    const geo = geoip.lookup("154.120.176.213");

    // Analyser l'URL de la requête
    const closer = req.query.closer;
    
    if (geo && closer && closer === 'true') {
        // Exemple d'utilisation
        const latitude = geo.ll[0]; // Latitude donnée
        const longitude = geo.ll[1]; // Longitude donnée
        const nombreDeResultats = 10; // Nombre de localisations à récupérer

        localisationsLesPlusProches(latitude, longitude, nombreDeResultats)
            .then((resultats) => {
                // Afficher les résultats
                // console.log('Localisations les plus proches:', resultats);

                res.render("index", {
                    "is_connected" : is_connected,
                    "user": req.cookies.user,
                    "token": req.cookies.token,
                    "all_vendor" : all_supp,
                    "all_vendor_limit" : resultats,
                    "currentPage" : 1,
                    "page_max" : 1,
                });
            })
            .catch((error) => {
                console.error('Erreur:', error);
            });
            
    } else {
        // console.log('Impossible de déterminer la localisation pour cette adresse IP.');
        
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
    }

    
})


server.listen(port, () => {
    console.log(`Maintenant à l'écoute sur le port ${port}`);
});

async function localisationsLesPlusProches(latitude, longitude, nombreDeResultats) {
    try {
        // Calculez la distance en utilisant des fonctions trigonométriques (par exemple, la formule de Haversine)
        const localisations = await Supplier.findAll({
            attributes: [
                'id', 'email', 'company_url', 'company_name', 'company_photo', 'nif', 'stat', 'rcs', 'address', 'ville', 'country', 'latitude', 'longitude', 'schedule_id', 'user_id', 'subscription',
                // Calculez la distance entre les localisations et la latitude/longitude donnée
                [sequelize.literal(`6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude)))`), 'distance']
            ],
            order: sequelize.literal('distance'), // Triez les résultats par distance
            limit: nombreDeResultats // Limitez le nombre de résultats
        });

        return localisations;
    } catch (error) {
        console.error('Erreur lors de la recherche des localisations les plus proches:', error);
        throw error;
    }
}