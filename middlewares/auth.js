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