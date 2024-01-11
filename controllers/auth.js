// const { model } = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");
const axios = require("axios")

exports.signup = async (req, res) => {

    if (req.body.googleAccessToken) {

        const data = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                'Authorization': `Bearer ${req.body.googleAccessToken}`,
            },
        });

        if (data) {

            const userName = data.data.name;
            const emailId = data.data.email;


            const userExists = await User.findOne({ emailId });
            const role = "user";

            if (userExists) {
                res.status(400).json({ msg: "User already exist" });
            }
            const hashPassword = await bcrypt.hash("password", 10);
            const user = await User.create({
                userName,
                emailId,
                hashPassword,
                role
            });

            const token = jwt.sign({
                email: user.emailId,
                id: user._id
            }, process.env.JWT_SECRET, { expiresIn: "4h" })

            res.status(201).json({
                msg: "User Created Successfully",
                User: {
                    _id: user._id,
                    username: user.userName,
                    emailId: user.emailId,
                    role: user.role
                },
                Token: { token }
            });
        } else {
            return res.status(400).json({ msg: "Unable to create account" });
        }


    } else {

        const { userName, emailId, password } = req.body;

        if (!userName || !emailId || !password) {
            return res.status(400).json({ msg: "Please Enter all the Fields" });
        }

        const userExists = await User.findOne({ emailId });

        if (userExists) {
            return res.status(400).json({ msg: "User already exist" });
        }
        const role = "user";
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            userName,
            emailId,
            hashPassword,
            role
        });

        const token = jwt.sign({
            email: user.emailId,
            id: user._id
        }, process.env.JWT_SECRET, { expiresIn: "4h" })

        if (user) {
            return res.status(201).json({
                msg: "User Created Successfully",
                User: {
                    _id: user._id,
                    username: user.userName,
                    emailId: user.emailId,
                    role: user.role
                },
                Token: token
            });
        } else {
            return res.status(400).json({ msg: "Unable to create user account" });
        }
    }

};


exports.login = async (req, res) => {

    if (req.body.googleAccessToken) {
        const data = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                'Authorization': `Bearer ${req.body.googleAccessToken}`,
            },
        });

        if (data) {
            const emailId = data.data.email;

            const user = await User.findOne({ emailId });

            if (!user) {
                return res.status(400).json({ msg: "User does not exist" });
            }

            const token = jwt.sign({
                email: user.emailId,
                id: user._id
            }, process.env.JWT_SECRET, { expiresIn: "4h" })


            return res.status(201).json({
                msg: "User loggedIn Successfully",
                User: {
                    _id: user._id,
                    username: user.userName,
                    emailId: user.emailId,
                    role: user.role
                },
                Token: { token }
            });

        } else {
            return res.status(400).json({ msg: "User does not exist" });
        }


    } else {
        const { emailId, password, googleAccessToken } = req.body;
        if (!emailId || !password) {
            return res.status(400).json({ msg: "Please Enter all the Fields" });
        }

        const user = await User.findOne({ emailId });

        if (user) {
            const isValid = await bcrypt.compare(password, user.hashPassword)


            if (!isValid) {
                return res.status(400).json({ msg: "Invalid info!" });
            }
            else {

                const token = jwt.sign({
                    email: user.emailId,
                    id: user._id
                }, process.env.JWT_SECRET, { expiresIn: "4h" })

                return res.status(201).json({
                    msg: "You Loggedin Successfully",
                    User: {
                        _id: user._id,
                        userName: user.userName,
                        emailId: user.emailId,
                        role: user.role
                    },
                    Token: { token }
                });
            }

        }
        else {
            return res.status(400).json({ msg: "User Not Found" });
        }
    }

};

exports.verifyMail = async (req, res) => {
    const { id } = req.body;

    const user = await User.findOne({ _id: id });
    if (!user) {
        return res.status(400).json({ msg: "User Not Found" });
    }

    try {
        const UpdateInfo = await User.updateOne({
            _id: id,
        }, {
            $set: {
                isverified: true
            }
        })

        return res.status(201).json({ msg: "Account Verified Successfully", Info: UpdateInfo });
    } catch (error) {
        return res.status(400).json({ msg: "Unable to Verify Mail" });
    }
};

exports.forgotpassword = async (req, res) => {
    const { emailId } = req.body;
    if (!emailId) {
        return res.status(400).json({ msg: "Please Enter all the Fields" });
    }
    try {
        const user = await User.findOne({ emailId });
        if (user) {

            const secret = process.env.JWT_SECRET + user.hashPassword;
            const token = jwt.sign({ email: user.emailId, id: user._id }, secret, {
                expiresIn: "5m"
            })
            const link = `http://localhost:3000/reset-password/${user._id}/${token}`;
            var transporter = await nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'sendermail169@gmail.com',
                    pass: 'djlhryfqbkxezfgh'
                }
            });

            var mailOptions = {
                from: 'youremail@gmail.com',
                to: emailId,
                subject: 'Password Reset',
                text: link
            };


            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            return res.status(201).json({ msg: "Email Has Send!!" });

        } else {
            return res.status(400).json({ msg: "User Not Exists!!" });
        }
    } catch (error) {

    }

};

exports.resetpassword = async (req, res) => {
    const { id, token } = req.params;
    const user = await User.findOne({ _id: id });
    if (!user) {
        return res.status(400).json({ msg: "User Not Found" });
    }

    const secret = process.env.JWT_SECRET + user.hashPassword;
    try {
        const verify = jwt.verify(token, secret);
        res.render("resetpassword", { email: verify.email, status: "Not Verified" })
    } catch (error) {
        return res.status(400).json({ msg: "Not Verified" });
    }
};

exports.resetpassworddone = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ _id: id });
    if (!user) {
        return res.status(400).json({ msg: "User Not Found" });
    }

    const secret = process.env.JWT_SECRET + user.hashPassword;
    try {
        const verify = jwt.verify(token, secret);
        const hashPassword = await bcrypt.hash(password, 10);

        await User.updateOne({
            _id: id,
        }, {
            $set: {
                hashPassword: hashPassword
            }
        })
        return res.status(201).json({ msg: "Password is Successfully Updated" });
    } catch (error) {
        return res.status(400).json({ msg: "Unable to Update password" });
    }
};