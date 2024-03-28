//importing modules
const express = require('express')
const supController = require('../controllers/suppliersController')
const supAuth = require('../middleware/suppliersMiddleware')
const { 
    getAllSuppliers,
    getSupplierById,
    signup,
    setlatlong, 
    logout
    } = supController

const router = express.Router()

//signup endpoint
//passing the middleware function to the signup
router.post('/save-supplier', supAuth.saveSupplier, signup)

router.post('/set-lat-long', setlatlong)



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

module.exports = router
