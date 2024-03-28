//importing modules
const bcrypt = require("bcrypt");
const db = require('../connexion');

const express = require('express');
const app = express();

// Assigning users to the variable User
const Product = require('../models/product');

const saveProduct = async (req, res) => {
    try {

        const data = {
            name : req.body.name,
            description : req.body.description,
            price  :req.body.price,
            devise : req.body.devise,
            photo : null,
            rates : 0,
            category : req.body.category,
            avis : req.body.avis,
            supplier_id : req.body.supplier_id,
            is_promotion : 0
        }

        Product.create(data).then(rep=>{
            res.redirect("my-account/products");
        })
        
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