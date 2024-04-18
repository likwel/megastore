//importing modules
const express = require('express')

const sequelize = require('sequelize');

const multer = require('multer');
const path = require('path');

const Op = sequelize.Op;

const proController = require('../controllers/productsController')
const { 
    saveProduct,
    getAllProduct
    } = proController

const router = express.Router()

const Supplier = require('../models/supplier');
const Schedule = require('../models/schedule');
const Product = require('../models/product');
const Ads = require('../models/ads');

// Configuration de Multer pour gérer les uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'public/data/uploads/') // Le dossier où les fichiers seront sauvegardés
    },
    filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Nom du fichier
    }
  });
  
const upload = multer({ storage: storage });
  

router.post('/my-acount/product/create', upload.fields([{ name: 'featured_image', maxCount: 1 }, { name: 'galleries' }]), saveProduct );

router.get('/getAllProduct', getAllProduct)

router.get('/:username', async (req, res) => {

    let username = req.params.username

    let page = (req.query.page && req.query.page > 0 )?req.query.page:1;

    //find a supplier by their email
    const supplier = await Supplier.findOne({
        where: {
            company_url: username
        }

    });

    let is_connected = false;

    if(req.cookies.user){
        is_connected=true
    }

    if(supplier){

        let all_products = await Product.findAll({
            where: {
                supplier_id: supplier.id
            }
        });

        // Simple template => GRATUIT MODE
        if(supplier.subscription == 0){
            res.render("shop/basic", {
                "is_connected" : is_connected,
                "vendor": req.cookies.vendor,
                "user": req.cookies.user,
                "token": req.cookies.token,
                "all_products":all_products,
                "supplier": supplier,
                "basic" : 0,
            });
        }
        // Simple template => BASIC MODE
        if(supplier.subscription == 1){
            res.render("shop/basic", {
                "is_connected" : is_connected,
                "vendor": req.cookies.vendor,
                "user": req.cookies.user,
                "token": req.cookies.token,
                "all_products":all_products,
                "supplier": supplier,
                "basic" : 1,
            });
        }

        // Attractive template => PRO MODE
        if(supplier.subscription == 2){
            res.render("shop/basic", {
                "is_connected" : is_connected,
                "vendor": req.cookies.vendor,
                "user": req.cookies.user,
                "token": req.cookies.token,
                "all_products":all_products,
                "supplier": supplier
            });
        }

         // E-commerce template => AFFAIRE - ENTREPISE - ILLIMITED MODE
         if(supplier.subscription == 3 || supplier.subscription == 4 || supplier.subscription == 5){
            res.render("shop/basic", {
                "is_connected" : is_connected,
                "vendor": req.cookies.vendor,
                "user": req.cookies.user,
                "token": req.cookies.token,
                "all_products":all_products,
                "supplier": supplier
            });
        }

        
    }else{

        if(username==="shop"){

            // console.log("Ato tsika zany");

            const limit = 6; // Nombre de produits par page

            // Calculer l'offset en fonction de la page actuelle
            const offset = (page - 1) * limit;

            let tous_sans_filtre = await Product.findAll();

            let all_products = await Product.findAll({
                offset: offset,
                limit: limit,
            });

            let all_sponsored = await Product.findAll({
                where: {
                    is_sponsored: true
                }
            });

            let ads = await Ads.findAll();

            // console.log(all_products);
            const maxPage = Math.ceil(tous_sans_filtre.length/limit);
    
            res.render("shop/all-spaces-sidebar", {
                "is_connected" : is_connected,
                "vendor": req.cookies.vendor,
                "user": req.cookies.user,
                "token": req.cookies.token,
                "all_products" : all_products,
                "all_sponsored" : all_sponsored,
                "ads" : ads,
                "currentPage" : page,
                "page_max" : maxPage,
                "total_products" :tous_sans_filtre.length
            });
        }
    }
    // else{
    //     res.render("shop/home3", {
    //         "is_connected" : is_connected,
    //         "vendor": req.cookies.vendor,
    //         "user": req.cookies.user,
    //         "token": req.cookies.token
    //     });
    // }

    

    
})

router.get('/shop/product/:id', async (req, res) => {

    // let product = await Product.findAll();

    const product = await Product.findOne({
        where: {
            id: req.params.id,
        }

    });
    
    const similar_product =  await Product.findAll({
        where: {
            name: {
                [Op.like]: '%'+product.name+'%'
              }
        }
    })

    let is_connected = false;

    if(req.cookies.user){
        is_connected=true
    }

    res.render("shop/product-detail", {
        "is_connected" : is_connected,
        "vendor": req.cookies.vendor,
        "user": req.cookies.user,
        "token": req.cookies.token,
        "product" : product,
        "product_simitaire" : similar_product
    });

})


module.exports = router
