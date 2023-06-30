import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {validationResult} from "express-validator";

export const login = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email})
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password"
            })
        }

        const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash)
        if (!isValidPassword) {
            return res.status(400).json({
                message: "Incorrect email or password"
            })
        }

        const token = jwt.sign(
            {
                _id: user._id
            },
            '25111996',
            {
                expiresIn: '60d',
            }
        )

        const {passwordHash, confirmPassword, ...userData} = user._doc;

        res.json({
            ...userData,
            token,
        });

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Failed to login"
        })
    }
}


export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const {password, confirmPassword, ...userData } = req.body

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password mismatch" })
        }

        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)

        const user = new User({
            ...userData,
            passwordHash,
            avatar: req.body.avatar,
        });

        const savedUser = await user.save();

        const token = jwt.sign(
            {
                _id: savedUser._id,
            },
            '25111996',
            {
                expiresIn: '60d',
            }
        );

        res.json({
            ...savedUser._doc,
            passwordHash: undefined,
            confirmPassword: undefined,
            token,
        });

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Failed to register"
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req._id)
        console.log(user)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const {passwordHash, confirmPassword, ...userData} = user._doc

        res.json(userData)

    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: "No access"
        })
    }
}