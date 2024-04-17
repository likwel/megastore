//importing modules
const bcrypt = require("bcrypt");
const db = require('../connexion');

const express = require('express');
const app = express();

// Assigning users to the variable User
const Product = require('../models/product');

const saveProduct = async (req, res) => {
    try {

        const singleImage = req.files['featured_image'] ? req.files['featured_image'][0].filename : null; // Nom du fichier de l'image unique
        const multipleImages = req.files['galleries'] ? req.files['galleries'].map(file => "/data/uploads/"+file.filename) : [];

        const data = {
            name : req.body.name,
            description : req.body.description,
            reference : req.body.reference,
            price  :req.body.price,
            last_price : 0,
            devise : req.body.devise,
            weight : 0,
            featured_image : "/data/uploads/"+singleImage,
            photos : multipleImages,
            rates : 0,
            category : req.body.category,
            // avis : req.body.avis,
            supplier_id : req.body.supplier_id,
            review_id : 1,
            is_promotion : 0,
            is_active : 1,
            is_promotion : 0,
            is_sponsored :0,
            is_suggested :0
        }

        // console.log(data);

        Product.create(data).then(rep=>{
            // res.redirect("my-account/products");
            console.log("Product created");
        })

        // res.status(200).send('Article ajouté avec succès');

        res.redirect('/my-account/products');
        
    } catch (error) {
        console.log(error);
    }
}

const getAllProduct = async (req, res) => {
    Product.findAll().then(result => {
        res.send(result);
    })
}


module.exports = {
    saveProduct,
    getAllProduct
};