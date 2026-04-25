const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const userSchemaDb = require("../models/user");
const user = require('../models/user');

async function registerUser(req, res) {
    try {
        const { fullname, email, password, role, occupation, experience } = req.body;

        const userExistOrNot = await userSchemaDb.findOne({ email })

        // if (userExistOrNot) {
        //     return res.status(400).json({
        //         message: "The user already exist"
        //     })
        // }

        if (userExistOrNot) {
            return res.status(400).render("register", {
                message: "The user already exist"
            })
        }

        const hashedPass = await bcrypt.hash(password, saltRounds);

        await userSchemaDb.create({
            fullname,
            email,
            password: hashedPass,
            role,
            occupation,
            experience
        })

        return res.status(201).redirect("/login");

    }
    catch (err) {
        return res.status(500).render("register", {
            message: "Something went wrong"
        })
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(404).render("login", {
                message: "The data not found"
            })
        }

        const checkUserExistOrNot = await userSchemaDb.findOne({ email })

        if (!checkUserExistOrNot) {
            return res.status(400).render("login", {
                message: "The user not found"
            })
        }

        const comaparePass = await bcrypt.compare(password, checkUserExistOrNot.password)

        if (!comaparePass) {
            return res.status(400).render("login", {
                message: "The password is incorrect"
            })
        }

        const token = jwt.sign({
            userId: checkUserExistOrNot._id,
            role: checkUserExistOrNot.role
        },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        )

        res.cookie('token', token);

        return res.status(200).redirect("/jobs/alljobs");

    }
    catch (err) {
        return res.status(500).render("login", {
            message: err.message
        })
    }
}

async function profilePage(req, res) {
    try {
        return res.status(200).json({
            message: "Protected route accessed",
            user: req.user
        })
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

async function registerPage(req, res) {
    return res.render('register');
}

async function loginPage(req, res) {
    return res.render('login');
}

module.exports = { registerUser, loginUser, profilePage, registerPage, loginPage };