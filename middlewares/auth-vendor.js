const Vendor = require('../models/vendor');
const jwt = require('jsonwebtoken');
const ErrorResponse = require("../utils/errorResponse");

exports.isAuthenticated = async (req, res, next) => {
  const {token} = req.cookies;

  if(!token) {
    return next(new ErrorResponse("You must login", 401));
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.vendor = await Vendor.findById(decode.id);
    next();

  } catch (error) {
    return next(new ErrorResponse("You must login", 401));
  }
}