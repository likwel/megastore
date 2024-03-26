//importing modules
const bcrypt = require("bcrypt");
const db = require('../connexion');
const jwt = require("jsonwebtoken");

const express = require('express');
const app = express();

// Assigning users to the variable User
const Supplier = require('../models/supplier');

//signing a user up
//hashing users password before its saved to the database with bcrypt
const signup = async (req, res) => {
    try {
        // const { username, email, roles, fullname, password } = req.body;

        // console.log(req.body);

        const data = {
            username : req.body.username,
            fullname : req.body.fullname,
            email  :req.body.email,
            types : "users",
            photo : null,
            address : req.body.address,
            telephone : req.body.telephone,
            ville : req.body.ville,
            country : req.body.country,
            roles : "User",
            password : await bcrypt.hash(req.body.password, 10)
        }

        // console.log(req.body.terms);

        // let user = null;
        
        if(req.body.password == req.body.password_confirm && req.body.terms == "on"){
            Supplier.create(data).then(rep=>{

                let new_user =  Supplier.findOne({
                    where: {
                        email: req.body.email
                    }
        
                });

                console.log("user created");

                let token = jwt.sign({ id: new_user.id }, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: 1 * 24 * 60 * 60 * 1000,
                });
    
                res.cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: false });
                res.cookie("user", JSON.stringify(new_user), {maxAge: 86400000, httpOnly: false});
                // console.log("User created");
                res.redirect("/")


            });


        }else{
            console.log("Mot de password incorrect");
            return res.status(409).send("Mot de passe invalide");
            
        }


    } catch (error) {
        console.log(error);
    }
};


//login authentication

const login = async (req, res) => {
    try {
        // res.set('Content-Type', 'application/json');

        // console.log( req.body);

        const { email, password } = req.body;

        //find a user by their email
        const user = await Supplier.findOne({
            where: {
                email: req.body.email
            }

        });

        //if user email is found, compare password with bcrypt
        if (user) {
            const isSame = await bcrypt.compare(password, user.password);

            //if password is the same
            //generate token with the user's id and the secretKey in the env file

            if (isSame) {
                let token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: 1 * 24 * 60 * 60 * 1000,
                });

                //if password matches wit the one in the database
                //go ahead and generate a cookie for the user
                // res.setHeader('Content-Type', 'application/json');
                res.cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: false });
                res.cookie("user", JSON.stringify(user), {maxAge: 86400000, httpOnly: false});
                //console.log("user", JSON.stringify(user, null, 2));
                //console.log(token);
                //send user data
                res.redirect('/')
                // return res.status(200).send(user);
            } else {
                return res.status(401).send("Authentication failed");
            }
        } else {
            return res.status(401).send("Authentication failed");
        }
    } catch (error) {
        console.log(error);
    }
};

const getAllSuppliers = async (req, res) => {
    Supplier.findAll().then(result => {
        res.send(result);
    })
}

const getSupplierById = async (req, res) => {
    Supplier.findOne({
        where : {
            // include: [{ model: Task}],
            id : req.params.id
        }
    }).then(result => {
        res.send(result);
    })
}

const updateSupplier = async (req, res, dataUser) => {
    Supplier.update(dataUser);
}

const logout = async (req, res) => {
    // req.cookies
    res.clearCookie("token");
    res.clearCookie("user");
    res.redirect("/");
}
module.exports = {
    getAllSuppliers,
    getSupplierById,
    signup,
    //login, 
    logout, 
    updateSupplier
};