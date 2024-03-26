//importing modules
const express = require('express')
const supController = require('../controllers/suppliersController')
const supAuth = require('../middleware/suppliersMiddleware')
const { 
    getAllSuppliers,
    getSupplierById,
    signup,
    login, 
    logout
    } = supController

const router = express.Router()

//signup endpoint
//passing the middleware function to the signup
router.post('/save-supplier', supAuth.saveSupplier, signup)



// login user
// router.post('/login', login)

// router.get('/logout', logout)

//view register
// router.get('/sign-up', (req, res) => {
//     res.render("register")
// })

// router.get('/sign-in', (req, res) => {
//     res.render("login");
// })


//get all users
router.get('/getAllSupplier', getAllSuppliers)

module.exports = router
