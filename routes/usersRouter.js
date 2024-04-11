//importing modules
const express = require('express')
const userController = require('../controllers/usersController')
const userAuth = require('../middleware/usersMiddleware')

const Product = require('../models/product');

const { 
    getAllUsers,
    getUserById,
    signup,
    login, 
    logout
    } = userController

const router = express.Router()

//signup endpoint
//passing the middleware function to the signup
router.post('/save-user', userAuth.saveUser, signup)

// login user
router.post('/login', login)

router.get('/logout', logout)

//view register
router.get('/sign-up', (req, res) => {
    res.render("register")
})

router.get('/sign-in', (req, res) => {
    res.render("login");
})

//get all users
router.get('/getAllUsers', getAllUsers)


router.get('/my-account', (req, res) => {

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


router.get('/my-account/settings', (req, res) => {

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

router.get('/my-account/setting-advanced', (req, res) => {

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

router.get('/my-account/security', (req, res) => {

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

router.get('/my-account/products', async (req, res) => {

    let is_connected = false;
    let all_product =[];

    if(req.cookies.user){
        is_connected=true
    }

    // console.log(JSON.parse(req.cookies.vendor));

    if(req.cookies.vendor){
        all_product =  await Product.findAll({
            where: {
                supplier_id: JSON.parse(req.cookies.vendor).id
            }
        })
    }

    res.render("products", {
        "is_connected" : is_connected,
        "vendor": req.cookies.vendor,
        "user": req.cookies.user,
        "token": req.cookies.token,
        "all_product": all_product,
    });
})


module.exports = router
