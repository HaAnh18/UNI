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

const Vendor = require("../models/vendor");
const Customer = require("../models/customer");
const ErrorResponse = require("../utils/errorResponse");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Product = require("../models/product");
const Shipper = require("../models/shipper");
const Order = require("../models/order");
const bcrypt = require("bcryptjs");

// Create a multer disk storage configuration
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");  // Specify the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());  // Generate a unique filename for the uploaded file
  },
});

// Create a multer instance with the configured storage
var upload = multer({ storage: storage });

// Export a function to handle file uploads
exports.handleFileUpload = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return next(err); // Pass any error to the next middleware
    }
    next(); // Proceed to the next middelware if the upload is successful
  });
};

// Export the signup function
exports.signup = async (req, res, next) => {
  try {
    // Prepare data
    var data = {
      username: req.body.username,
      password: req.body.password,
      photo: {
        data: fs.readFileSync(
          path.join(__dirname + "/../uploads/" + req.file.filename)
        ),
        contentType: "image/png",
      },
      name: req.body.name,
      address: req.body.address,
    };

    // Check if username and address has existed or not
    const vendorExist = await Vendor.findOne({username: data.username});
    const usernameExistInCustomer = await Customer.findOne({username: data.username});
    const usernameExistInShipper = await Shipper.findOne({username: data.username});
    const addressExist = await Vendor.findOne({address: data.address});

    if (vendorExist || usernameExistInCustomer || usernameExistInShipper) {
      return res.render("vendor/signup", { message: "Username already exists" });
    }

    if (addressExist) {
      return res.render("vendor/signup", { message: "Address already exists" });
    }

    Vendor.create(data);

    res.render("vendor/login");
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
    next(error);
  }
};

// Exports a signin function
exports.signin = async (req, res, next) => {
  try {
    // Prepare data
    var info = {
      username: req.body.username,
      password: req.body.password,
    };

    if (!info.username || !info.password) {
      return res.render("vendor/login", {
        message: "Username and password are required",
      });
    }

    // CHECK USERNAME
    const vendor = await Vendor.findOne({ username: info.username });
    if (!vendor) {
      return res.render("vendor/login", { message: "Invalid credentials" });
    }

    // VERIFY CUSTOMER'S PASSWORD
    const isMatched = await vendor.comparePassword(info.password);
    if (!isMatched) {
      return res.render("vendor/login", { message: "Invalid credentials" });
    }

    generateToken(vendor, 200, res);
  } catch (error) {
    console.log(error);
    next(new ErrorResponse(`Cannot log in, check your credentials`, 400));
  }
};

// Generate the token for vendor
const generateToken = async (vendor, statusCode, res) => {
  const token = await vendor.jwtGenerateToken();

  const options = {
    httpOnly: true,
    expiresIn: new Date(Date.now() + process.env.EXPIRE_TOKEN),
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .redirect("/api/vendor/dashboard");
};

// LOG OUT USER
exports.logout = (req, res, next) => {
  res.clearCookie("token");
  res.render("vendor/login");
};

// Add product function
exports.addProduct = async (req, res, next) => {
  try {
    var productInfo = {
      category: req.body.category,
      name: req.body.name,
      price: req.body.price,
      photo: {
        data: fs.readFileSync(
          path.join(__dirname + "/../uploads/" + req.file.filename)
        ),
        contentType: "image/png",
      },
      description: req.body.description,
      vendorId: req.vendor,
    };

    Product.create(productInfo);
    res.redirect("/api/vendor/products");
  } catch (error) {
    console.log(error.message);
  }
};

//Show overview information in dashboard
exports.showDashboard = async (req, res) => {
  const vendor = await Vendor.findById(req.vendor);
  const orders = await Order.find({ vendor: vendor.id });
  const listOfOrders = [];
  var total = 0;
  for (var i = 0; i < orders.length; i++) {
    var customer = await Customer.findById(orders[i].customer);
    Object.assign(orders[i], { customerName: customer.name });
    listOfOrders.push(orders[i]);
    if (orders[i].status == "Completed") {
      total += orders[i].total;
    }
  }
  res.render("vendor/vendor", {
    vendor: vendor,
    orders: listOfOrders,
    total: total,
  });
};

// Show all products that vendor has
exports.showProduct = async (req, res) => {
  const vendor = await Vendor.findById(req.vendor);
  const products = await Product.find({ vendorId: vendor.id });
  res.render("vendor/products", { vendor: vendor, products: products });
};

// Display login page
exports.getLogin = async (req, res) => {
  res.render("vendor/login");
};

// Display a signup page
exports.getSignup = async (req, res) => {
  res.render("vendor/signup");
};

// Display add product page
exports.getAddProduct = async (req, res) => {
  const vendor = await Vendor.findById(req.vendor);
  res.render("vendor/add-product", { vendor: vendor });
};

// Display vendor's profile
exports.vendorProfile = async (req, res) => {
  const vendor = await Vendor.findById(req.vendor);
  res.render("vendor/profile", { vendor: vendor });
};

// Display term service
exports.termService = async (req, res) => {
  res.render("vendor/termService");
};

// Display pending order
exports.pendingOrder = async (req, res) => {
  const vendor = await Vendor.findById(req.vendor);
  const orders = await Order.find({ vendor: req.vendor });
  const listOfOrders = [];
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].status == "Pending") {
      var customer = await Customer.findById(orders[i].customer);
      Object.assign(orders[i], { customerName: customer.name });
      listOfOrders.push(orders[i]);
    }
  }
  res.render("vendor/pendingorder", { vendor: vendor, orders: listOfOrders });
};

// Display active order
exports.activeOrder = async (req, res) => {
  const vendor = await Vendor.findById(req.vendor);
  const orders = await Order.find({ vendor: req.vendor });
  const listOfOrders = [];
  for (var i = 0; i < orders.length; i++){
    if (orders[i].status == "Active") {
      var customer = await Customer.findById(orders[i].customer);
      Object.assign(orders[i], { customerName: customer.name });
      listOfOrders.push(orders[i]);
    }
  }
  res.render("vendor/active-order", { vendor: vendor, orders: listOfOrders });
};

// Display completed order
exports.completedOrder = async (req, res) => {
  const vendor = await Vendor.findById(req.vendor);
  const orders = await Order.find({ vendor: req.vendor });
  const listOfOrders = [];
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].status == "Completed") {
      var customer = await Customer.findById(orders[i].customer);
      Object.assign(orders[i], { customerName: customer.name });
      listOfOrders.push(orders[i]);
    }
  }
  res.render("vendor/completedorder", { vendor: vendor, orders: listOfOrders });
};

// Display cancelled order
exports.cancelledOrder = async (req, res) => {
  const vendor = await Vendor.findById(req.vendor);
  const orders = await Order.find({ vendor: req.vendor });
  const listOfOrders = [];
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].status == "Cancelled") {
      var customer = await Customer.findById(orders[i].customer);
      Object.assign(orders[i], { customerName: customer.name });
      listOfOrders.push(orders[i]);
    }
  }
  res.render("vendor/cancelledorder", { vendor: vendor, orders: listOfOrders });
};

// Display product detail
exports.productDetail = async (req, res) => {
  const vendor = await Vendor.findById(req.vendor);
  const product = await Product.findById(req.params.id);
  res.render("vendor/productDetail", { vendor: vendor, product: product });
};

// Edit vendor's profile
exports.editProfile = async (req, res) => {
  const vendor = await Vendor.findById(req.vendor);
  if (req.file == undefined) {
    // Find the document and update it
    Vendor.findOneAndUpdate(
    { _id: vendor.id}, // Specify the filter criteria to find the document
    { $set: { 
      name: req.body.name,
      address: req.body.address,
    } }, // Specify the update operation
    { new: true } // Set the option to return the updated document
  )
  .then(updatedDocument => {
    // Handle the updated document
    res.redirect('/api/vendor/profile');
    // console.log(vendor);
  })
  .catch(error => {
    // Handle any errors that occur
    console.error(error);
  });    
  } else {
    //  Find the document and update it
  Vendor.findOneAndUpdate(
  { _id: vendor.id}, // Specify the filter criteria to find the document
  { $set: { 
    name: req.body.name,
    address: req.body.address,
    photo: {
      data: fs.readFileSync(path.join(__dirname + '/../uploads/' + req.file.filename)),
      contentType: 'image/png'
    },
  } }, // Specify the update operation
  { new: true } // Set the option to return the updated document
)
  .then(updatedDocument => {
    res.redirect('/api/vendor/profile');
  })
  .catch(error => {
    console.error(error);
  });
  }
};

// Update product's information
exports.editProduct = async (req, res) => {
  const vendor = await Vendor.findById(req.vendor);
  const product = await Product.findById(req.params.id);
  if (req.file == undefined) {
    // Find the document and update it
    Product.findOneAndUpdate(
      { _id: product.id }, // Specify the filter criteria to find the document
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          category: req.body.category,
          price: req.body.price,
        },
      }, // Specify the update operation
      { new: true } // Set the option to return the updated document
    )
      .then((updatedDocument) => {
        // Handle the updated document
        res.redirect("/api/vendor/products");
        // console.log(product);
      })
      .catch((error) => {
        // Handle any errors that occur
        console.error(error);
      });
  } else {
    //  Find the document and update it
    Product.findOneAndUpdate(
      { _id: product.id }, // Specify the filter criteria to find the document
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          photo: {
            data: fs.readFileSync(
              path.join(__dirname + "/../uploads/" + req.file.filename)
            ),
            contentType: "image/png",
          },
          category: req.body.category,
          price: req.body.price,
        },
      }, // Specify the update operation
      { new: true } // Set the option to return the updated document
    )
      .then((updatedDocument) => {
        // Handle the updated document
        // res.redirect(`/api/vendor/product/${res.parmas.id}`);
        res.redirect("/api/vendor/products");
      })
      .catch((error) => {
        // Handle any errors that occur
        console.error(error);
      });
  }
};

// Change order status from pending to active
exports.changeStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  // Find the document and update it
  Order.findOneAndUpdate(
    { _id: order.id }, // Specify the filter criteria to find the document
    { $set: { status: "Active" } }, // Specify the update operation
    { new: true } // Set the option to return the updated document
  )
    .then((updatedDocument) => {
      // Handle the updated document
      res.redirect("/api/vendor/dashboard");
    })
    .catch((error) => {
      // Handle any errors that occur
      console.error(error);
    });
};

// Change vendor's password and check if user input correct password
exports.changePassword = async (req,res) => {
  const vendor = await Vendor.findById(req.vendor);
  const hashPassword = bcrypt.hash(req.body.new, 10);
  const isMatched = await vendor.comparePassword(req.body.current);
  if (isMatched) {
    Vendor.findOneAndUpdate(
      { _id: customer.id }, // Specify the filter criteria to find the document
      { $set: { password: hashPassword } }, // Specify the update operation
      { new: true } // Set the option to return the updated document
    )
      .then(updatedDocument => {
        // Handle the updated document
        res.redirect('/api/vendor/profile');
      })
      .catch(error => {
        // Handle any errors that occur
        console.error(error);
      });
  } else {
    res.render('vendor/profile', {message: "Wrong password", vendor: vendor})
  }
};

// Display order detail
exports.getOrder = async (req,res) => {
  const vendor = await Vendor.findById(req.vendor);
  const order = await Order.findById(req.params.id);
  for (var i = 0; i< order.products.length; i++) {
    var product = await Product.findById(order.products[i].product);
    Object.assign(order.products[i], {productName: product.name });
  }
  res.render("vendor/order-details", {vendor: vendor, order: order});
};
