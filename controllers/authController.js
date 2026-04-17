const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const userSchemaDb = require("../models/user");
const user = require('../models/user');

async function registerUser(req, res) {
    try {
        const { fullname, email, password, role, occupation, experience } = req.body;

        const userExistOrNot = await userSchemaDb.findOne({ email })

        if (userExistOrNot) {
            return res.status(400).json({
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

        return res.status(201).json({
            message: "The user registered successfully"
        })

    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(404).json({
                message: "The data not found"
            })
        }

        const checkUserExistOrNot = await userSchemaDb.findOne({ email })

        if (!checkUserExistOrNot) {
            return res.status(400).json({
                message: "User not found"
            })
        }

        const comaparePass = await bcrypt.compare(password, checkUserExistOrNot.password)

        if (!comaparePass) {
            return res.status(400).json({
                message: "Invalid user"
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

        return res.status(200).json({
            message: "The user is logged in",
            token
        })

    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

module.exports = { registerUser, loginUser };