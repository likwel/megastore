//importing modules
const bcrypt = require("bcrypt");
const db = require('../connexion');
const jwt = require("jsonwebtoken");

const express = require('express');
const app = express();

// Assigning users to the variable User
const User = require('../models/users');
const Supplier = require('../models/supplier');

//signing a user up
//hashing users password before its saved to the database with bcrypt
const signup = async (req, res) => {
    try {

        const data = {
            username : req.body.username,
            fullname : req.body.fullname,
            email  :req.body.email,
            types : req.body.types,
            photo : null,
            address : req.body.address,
            telephone : req.body.telephone,
            ville : req.body.ville,
            country : req.body.country,
            roles : "User",
            password : await bcrypt.hash(req.body.password, 10)
        }

        if(req.body.password == req.body.password_confirm && req.body.terms == "on"){
            User.create(data).then(rep=>{

                let new_user = rep.dataValues;

                // console.log(new_user);

                if(new_user.types=="client" || new_user.types=="users"){
                    console.log("user created");

                    let token = jwt.sign({ id: new_user.id }, process.env.ACCESS_TOKEN_SECRET, {
                        expiresIn: 1 * 24 * 60 * 60 * 1000,
                    });
        
                    res.cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: false });
                    res.cookie("user", JSON.stringify(new_user), {maxAge: 86400000, httpOnly: false});
                    // console.log("User created");
                    res.redirect("/my-account")
                }else{
                    // res.cookie("user_id",new_user.id, {maxAge: 86400000, httpOnly: false})
                    res.redirect("/sign-up/supplier?user_id="+new_user.id)
                }


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

        const { email, password } = req.body;

        //find a user by their email
        const user = await User.findOne({
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
                
                res.cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: false });
                res.cookie("user", JSON.stringify(user), {maxAge: 86400000, httpOnly: false});

                if(user.types=="vendor"){

                    let sup = await Supplier.findOne({
                        where: {
                            user_id : user.id
                        }
                    });
        
                    res.cookie("vendor", JSON.stringify(sup), {maxAge: 86400000, httpOnly: false});
                }

                res.redirect('/my-account')
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

const getAllUsers = async (req, res) => {
    User.findAll().then(result => {
        res.send(result);
    })
}

const getUserById = async (req, res) => {
    User.findOne({
        where : {
            // include: [{ model: Task}],
            id : req.params.id
        }
    }).then(result => {
        res.send(result);
    })
}

const updateUser = async (req, res, dataUser) => {
    User.update(dataUser);
}

const logout = async (req, res) => {
    // req.cookies
    res.clearCookie("token");
    res.clearCookie("user");
    res.clearCookie("vendor");
    res.redirect("/");
}
module.exports = {
    getAllUsers,
    getUserById,
    signup,
    login, 
    logout, 
    updateUser
};