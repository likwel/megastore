//importing modules
const express = require('express')

const router = express.Router()

router.get('/page/faq', (req, res) => {

    let is_connected = false;
    if(req.cookies.user){
        is_connected=true
    }
    
    res.render("faq", {
        "is_connected" : is_connected,
        "user": req.cookies.user,
        "vendor": req.cookies.vendor,
        "token": req.cookies.token
    });

})

router.get('/page/pricing', (req, res) => {

    let is_connected = false;
    if(req.cookies.user){
        is_connected=true
    }
    
    res.render("pricing", {
        "is_connected" : is_connected,
        "user": req.cookies.user,
        "vendor": req.cookies.vendor,
        "token": req.cookies.token
    });

})

// app.get('/cart', (req, res) => {
//     res.render("index");
// })


module.exports = router
