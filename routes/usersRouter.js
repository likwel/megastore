//importing modules
const express = require('express')
const userController = require('../controllers/usersController')
const userAuth = require('../middleware/usersMiddleware')
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

module.exports = router
