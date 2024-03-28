//importing modules
const express = require('express')
const proController = require('../controllers/productsController')
const { 
    saveProduct,
    getAllProduct
    } = proController

const router = express.Router()

//signup endpoint
//passing the middleware function to the signup
router.post('/save-product', saveProduct)

router.get('/getAllProduct', getAllProduct)


//view register
// router.get('/sign-up/supplier', (req, res) => {
//     let user_id = req.query.user_id
//     res.render("register-supplier",{
//         user_id : user_id,
//     })
// })


module.exports = router
