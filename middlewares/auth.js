// RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023A
// Assessment: Assignment 2
// Author: Tom's Prodigies V2
// ID: 
// Nguyen Tran Ha Anh: s3938490
// Dang Kim Quang Minh: s3938024
// Nguyen Gia Bao: s3938143
// Hoang Tuan Minh: s3924716
// Vu Loc: s3891483
// Acknowledgement: 

const Customer = require('../models/customer');
const jwt = require('jsonwebtoken');
const ErrorResponse = require("../utils/errorResponse");

exports.isAuthenticated = async (req, res, next) => {


  try {
    const {token} = req.cookies;

    if(!token) {
      return res.render("customer/login", {message: "You must login"});
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Customer.findById(decode.id);
    next();

  } catch (error) {
    return res.render("customer/login", {message: "You must login"});
  }
}