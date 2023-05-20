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
// https://www.geeksforgeeks.org/upload-and-retrieve-image-on-mongodb-using-mongoose/


const Vendor = require("../models/vendor");
const Customer = require("../models/customer");
const Shipper = require("../models/shipper");
const Product = require("../models/product");
const Order = require("../models/order");
// const ErrorResponse = require("../utils/errorResponse");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

 
// Create a multer disk storage configuration
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads') // Specify the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now()) // Generate a unique filename for the uploaded file
  }
});
 
// Create a multer instance with the configured storage
var upload = multer({ storage: storage });

// Export a function to handle file uploads
exports.handleFileUpload = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return next(err); // Pass any error to the next middleware
    }
    next(); // Proceed to the next middelware if the upload is successful
  });
};

// Export a function for customer to signup
exports.signup = async (req, res, next) => {


  try {
        // Prepare data for creating a new customer
    var data = {
      username: req.body.username,
      password: req.body.password,
      photo: {
        data: fs.readFileSync(path.join(__dirname + '/../uploads/' + req.file.filename)),
        contentType: 'image/png'
      },
      distributionHub: req.body.distributionHub
    };


    // Check if username has existed or not
    const shipperExist = await Shipper.findOne({username: data.username});
    const usernameExistinCustomer = await Customer.findOne({username: data.username});
    const usernameExistinVendor = await Vendor.findOne({username: data.username});

    if (shipperExist || usernameExistinCustomer || usernameExistinVendor) {
      return res.render("shipper/signup_shipper", {message: "Username already exists"});
    }
  
    // Create an account for shipper
    Shipper.create(data);

    res.redirect('/api/shipper/signin');
     
  } catch(error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message
    })
    next(error);
  }
}

// Exports a signin function 
exports.signin = async (req, res, next) => {
  try {
    // Prepare data 
    var info = {
      username: req.body.username,
      password: req.body.password
    }
    // Check if username or password are filled
    if (!info.username || !info.password) {
      return res.render("shipper/login_shipper", {message: "Username and password are required"});
    }

    // CHECK USERNAME
    const shipper = await Shipper.findOne({username: info.username});
    if (!shipper) {
      return res.render("shipper/login_shipper", {message: "Invalid credentials"});
    };

    // VERIFY SHIPPER'S PASSWORD
    const isMatched = await shipper.comparePassword(info.password);
    if (!isMatched) {
      return res.render("shipper/login_shipper", {message: "Invalid credentials"});
    } 
    
    generateToken(shipper, 200, res);

  } catch (error) {
    console.log(error);
    next(new ErrorResponse(`Cannot log in, check your credentials`, 400));
  }
}

// Generate the token for shipper 
const generateToken = async (shipper, statusCode, res) => {

  const token = await shipper.jwtGenerateToken();

  const options = {
    httpOnly: true,
    expiresIn: new Date(Date.now() + process.env.EXPIRE_TOKEN)
  };

  res
  .status(statusCode)
  .cookie('token', token, options)
  .redirect('/api/shipper/dashboard');
}

// LOG OUT USER
exports.logout = (req, res, next) => {
  res.clearCookie('token');
  res.redirect('/api/shipper/signin');
}

// CUSTOMER PROFILE 
exports.shipperProfile = async (req, res, next) => {
  const shipper = await Shipper.findById(req.shipper);
  res.render('profile-shipper', { shipper: shipper.toObject({ getters: true }) });
}

// Display a signin page
exports.getSignin = (req,res) => {
  res.render("shipper/login_shipper");
};

// Display a signup page
exports.getSignup = (req,res) => {
  res.render("shipper/signup_shipper");
};

// Display an order detail
exports.getOrder = async (req,res) => {
  const shipper = await Shipper.findById(req.shipper);
  const order = await Order.findById(req.params.id);
  for (var i = 0; i< order.products.length; i++) {
    var product = await Product.findById(order.products[i].product);
    Object.assign(order.products[i], {productName: product.name });
  }
  res.render("shipper/order_detail", {shipper: shipper, order: order});
};

// Display shipper's profile
exports.getEditProfile = async (req,res) => {
  const shipper = await Shipper.findById(req.shipper);
  res.render("shipper/edit_profile", {shipper: shipper});
};

// Edit shipper's profile
exports.editProfile = async (req,res) => {
  const shipper = await Shipper.findById(req.shipper);
  if (req.file == undefined) {
     // Find the document and update it
  Shipper.findOneAndUpdate(
  { _id: shipper.id}, // Specify the filter criteria to find the document
  { $set: { 
    distributionHub: req.body.distributionHub
  } }, // Specify the update operation
  { new: true } // Set the option to return the updated document
)
  .then(updatedDocument => {
    // Handle the updated document
    res.redirect('/api/shipper/editprofile');
    // console.log(vendor);
  })
  .catch(error => {
    // Handle any errors that occur
    console.error(error);
  });
  } else {
    //  Find the document and update it
      Shipper.findOneAndUpdate(
      { _id: shipper.id}, // Specify the filter criteria to find the document
      { $set: { 
        photo: {
          data: fs.readFileSync(path.join(__dirname + '/../uploads/' + req.file.filename)),
          contentType: 'image/png'
        },
        distributionHub: req.body.distributionHub
     } }, // Specify the update operation
      { new: true } // Set the option to return the updated document
    )
      .then(updatedDocument => {
        // Handle the updated document
        res.redirect('/api/shipper/editprofile');
      })
      .catch(error => {
        // Handle any errors that occur
        console.error(error);
      });
  }
};

// Display approximate order 
exports.getDashboard = async (req, res) => {
  const shipper = await Shipper.findById(req.shipper);
  const orders = await Order.find();
  const listOfOrders = [];
  for (var i = 0; i< orders.length; i++) {
    if (orders[i].distribution == shipper.distributionHub
      && orders[i].status != "Pending") 
    { if (orders[i].status == "Active" || orders[i].shipper == shipper.username) {
      var customer = await Customer.findById(orders[i].customer);
      Object.assign(orders[i], {customerName: customer.name});
      listOfOrders.push(orders[i]);
    }
    }
  }
  res.render("shipper/shipper_dashboard", {shipper: shipper, orders: listOfOrders});
};

// Change order status to completed
exports.deliveredOrder = async (req,res) => {
  const shipper = await Shipper.findById(req.shipper);
  const order = await Order.findById(req.params.id);
 // Find the document and update it
  Order.findOneAndUpdate(
  { _id: order.id }, // Specify the filter criteria to find the document
  { $set: {
    status: 'Completed',    
    shipper: shipper.username
  } }, // Specify the update operation
  { new: true } // Set the option to return the updated document
)
  .then(updatedDocument => {
    // Handle the updated document
    res.redirect('/api/shipper/dashboard');
  })
  .catch(error => {
    // Handle any errors that occur
    console.error(error);
  });
}

// Change order status to cancelled
exports.cancelledOrder = async (req,res) => {
  const shipper = await Shipper.findById(req.shipper);
  const order = await Order.findById(req.params.id);
 // Find the document and update it
  Order.findOneAndUpdate(
  { _id: order.id }, // Specify the filter criteria to find the document
  { $set: { 
    status: 'Cancelled',
    shipper: shipper.username
   } }, // Specify the update operation
  { new: true } // Set the option to return the updated document
)
  .then(updatedDocument => {
    // Handle the updated document
    res.redirect('/api/shipper/dashboard');
  })
  .catch(error => {
    // Handle any errors that occur
    console.error(error);
  });
}

// Change shipper's password
exports.changePassword = async (req,res) => {
  const shipper = await Shipper.findById(req.shipper);
  const hashPassword = bcrypt.hash(req.body.new, 10);
  const isMatched = await shipper.comparePassword(req.body.current);
  if (isMatched) {
    Shipper.findOneAndUpdate(
      { _id: customer.id }, // Specify the filter criteria to find the document
      { $set: { password: hashPassword } }, // Specify the update operation
      { new: true } // Set the option to return the updated document
    )
      .then(updatedDocument => {
        // Handle the updated document
        res.redirect('/api/shipper/editprofile');
      })
      .catch(error => {
        // Handle any errors that occur
        console.error(error);
      });
  } else {
    res.render('shipper/edit_profile', {message: "Wrong password", shipper: shipper})
  }
};