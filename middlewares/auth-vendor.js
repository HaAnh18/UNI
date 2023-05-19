const Vendor = require('../models/vendor');
const jwt = require('jsonwebtoken');
const ErrorResponse = require("../utils/errorResponse");

exports.isAuthenticated = async (req, res, next) => {
  const {token} = req.cookies;

  if(!token) {
    return res.render("vendor/login", {message: "You must login"});
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.vendor = await Vendor.findById(decode.id);
    next();

  } catch (error) {
    return res.render("vendor/login", {message: "You must login"});
  }
}