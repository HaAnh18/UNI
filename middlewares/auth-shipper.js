const Shipper = require('../models/shipper');
const jwt = require('jsonwebtoken');
const ErrorResponse = require("../utils/errorResponse");

exports.isAuthenticated = async (req, res, next) => {
  const {token} = req.cookies;

  if(!token) {
    return next(new ErrorResponse("You must login", 401));
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.shipper = await Shipper.findById(decode.id);
    next();

  } catch (error) {
    return next(new ErrorResponse("You must login", 401));
  }
}