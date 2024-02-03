// const { model } = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");
const axios = require("axios")

exports.contactUs = async (req, res) => {
    const { name, email, message } = req.body;
    if (!email) {
        return res.status(400).json({ msg: "Please Enter all the Fields" });
    }
    try {

        var transporter = await nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'sendermail169@gmail.com',
                pass: 'djlhryfqbkxezfgh'
            }
        });

        var mailOptions = {
            from: email,
            // to: "akshaywairagadetp@gmail.com",
            to: "covidshield146@gmail.com",
            subject: `Message from ${name}`,
            text: message
        };


        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        return res.status(201).json({ msg: "Email Has Send!!" });


    } catch (error) {

    }

};