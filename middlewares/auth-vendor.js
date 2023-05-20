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

const Vendor = require('../models/vendor');
const jwt = require('jsonwebtoken');
// const ErrorResponse = require("../utils/errorResponse");

// Exports a check authenticated function
exports.isAuthenticated = async (req, res, next) => {
  const {token} = req.cookies;

    // If the token is not existed render to login page with message
  if(!token) {
    return res.render("vendor/login", {message: "You must login"});
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
        // Decode the token to get the vendor id 
    req.vendor = await Vendor.findById(decode.id);
    next();

  } catch (error) {
    return res.render("vendor/login", {message: "You must login"});
  }
}