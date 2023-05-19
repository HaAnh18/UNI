const Shipper = require('../models/shipper');
const jwt = require('jsonwebtoken');
const ErrorResponse = require("../utils/errorResponse");

exports.isAuthenticated = async (req, res, next) => {
  const {token} = req.cookies;

  if(!token) {
    return res.render("shipper/login_shipper", {message: "You must login"});
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.shipper = await Shipper.findById(decode.id);
    next();

  } catch (error) {
    return res.render("shipper/login_shipper", {message: "You must login"});
  }
}