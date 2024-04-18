//importing modules
const express = require('express')
const supController = require('../controllers/suppliersController')
const supAuth = require('../middleware/suppliersMiddleware')
const { 
    getAllSuppliers,
    getSupplierById,
    signup,
    setlatlong, 
    logout,
    choosePlan,
    } = supController

const router = express.Router()

const Supplier = require('../models/supplier');

//signup endpoint
//passing the middleware function to the signup
router.post('/save-supplier', supAuth.saveSupplier, signup)

router.post('/set-lat-long', setlatlong)

router.get('/update-plan', choosePlan)



// login user
// router.post('/login', login)

// router.get('/logout', logout)

//view register
router.get('/sign-up/supplier', (req, res) => {
    let user_id = req.query.user_id
    res.render("register-supplier",{
        user_id : user_id,
    })
})

// router.get('/sign-in', (req, res) => {
//     res.render("login");
// })


//get all users
router.get('/getAllSupplier', getAllSuppliers)

router.get('/vendor/:url',  async (req, res) => {

    let is_connected = false;
    if(req.cookies.user){
        is_connected=true
    }

    let supp = await Supplier.findOne({ 
        where: 
            { id: req.params.url},
        include: [{
            model: Product
        }]
    })

    // console.log(supp);
    
    res.render("vendor", {
        "is_connected" : is_connected,
        "user": req.cookies.user,
        "vendor": req.cookies.vendor,
        "token": req.cookies.token,
        "profil" : supp,
    });
})


module.exports = router
