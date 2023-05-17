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

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

exports.handleFileUpload = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return next(err);
    }
    next();
  });
};

exports.signup = async (req, res, next) => {
  try {
    // const customer = await Customer.create(req.body);
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

    const vendorExist = await Vendor.findOne({ username: data.username });
    const usernameExistInCustomer = await Customer.findOne({
      username: data.username,
    });
    const usernameExistInShipper = await shipper.findOne({
      username: data.username,
    });
    const addressExist = await Vendor.findOne({ address: data.address });

    if (vendorExist || usernameExistInCustomer || usernameExistInShipper) {
      return res.render("vendor/login", { message: "Username already exists" });
    }

    if (addressExist) {
      return res.render("vendor/login", { message: "Address already exists" });
    }

    Vendor.create(data);

    res.redirect("/api/vendor/signin");
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
    next(error);
  }
};

exports.signin = async (req, res, next) => {
  var info = {
    username: req.body.username,
    password: req.body.password,
  };
  // res.json(info.username);
  try {
    // const {username, password} = req.body;

    if (!info.username || !info.password) {
      return res.render("vendor/login", {
        message: "Username and password are required",
      });

      // return req.flash("wrong");
    }

    // CHECK USERNAME
    const vendor = await Vendor.findOne({ username: info.username });
    if (!vendor) {
      return res.render("vendor/login", { message: "Invalid credentials" });

      // return next(new ErrorResponse(`Invalid credentials`, 400));
    }

    // VERIFY CUSTOMER'S PASSWORD
    const isMatched = await vendor.comparePassword(info.password);
    if (!isMatched) {
      return res.render("vendor/login", { message: "Invalid credentials" });

      // res.redirect('/signin');
      // return next(new ErrorResponse(`Invalid credentials`, 400));
    }

    // console.log(req.user);
    generateToken(vendor, 200, res);
    // res.json(req.cookie)
    // res.redirect('/profile');
  } catch (error) {
    console.log(error);
    next(new ErrorResponse(`Cannot log in, check your credentials`, 400));
  }
};

const generateToken = async (vendor, statusCode, res) => {
  const token = await vendor.jwtGenerateToken();

  const options = {
    httpOnly: true,
    expiresIn: new Date(Date.now() + process.env.EXPIRE_TOKEN),
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    // .json({success: true, token})
    .redirect("/api/vendor/dashboard");
  // console.log(({success: true, token}))
};

// LOG OUT USER
exports.logout = (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out",
  });
};

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

//frontend
exports.showDashboard = async (req, res) => {
  const vendor = await Vendor.findById(req.vendor);
  res.render("vendor/vendor", { vendor: vendor });
};

exports.showProduct = async (req, res) => {
  const vendor = await Vendor.findById(req.vendor);
  const products = await Product.find({ vendorId: vendor.id });
  res.render("vendor/products", { vendor: vendor, products: products });
};

exports.getLogin = async (req, res) => {
  res.render("vendor/login");
};

exports.getSignup = async (req, res) => {
  res.render("vendor/signup");
};

exports.getAddProduct = async (req, res) => {
  const vendor = await Vendor.findById(req.vendor);
  res.render("vendor/add-product", { vendor: vendor });
};

exports.vendorProfile = async (req, res) => {
  const vendor = await Vendor.findById(req.vendor);
  res.render("vendor/profile", { vendor: vendor });
};

exports.termService = async (req, res) => {
  res.render("vendor/termService");
};

exports.pendingOrder = async (req, res) => {
  const vendor = await Vendor.findById(req.vendor);
  const orders = await Order.find({ vendor: req.vendor });
  const listOfOrders = [];
  // console.log(orders);
  for (var i = 0; i < orders.length; i++) {
    if (orders[i] == "Cancelled") {
      listOfOrders.push(orders[i]);
    }
  }
  res.render("vendor/pendingOrder", { vendor: vendor });
};

exports.activeOrder = async (req, res) => {
  const vendor = await Vendor.findById(req.vendor);
  const orders = await Order.find({ vendor: req.vendor });
  const listOfOrders = [];
  // console.log(orders);
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].status == "Active") {
      listOfOrders.push(orders[i]);
    }
  }
  console.log(listOfOrders);
  res.render("vendor/active-order", { vendor: vendor, orders: listOfOrders });
};

exports.cancelledOrder = async (req, res) => {
  const vendor = await Vendor.findById(req.vendor);
  res.render("vendor/cancelledOrder", { vendor: vendor });
};
exports.productDetail = async (req, res) => {
  const vendor = await Vendor.findById(req.vendor);
  res.render("vendor/productDetail", { vendor: vendor });
};
exports.orderDetail = async (req, res) => {
  const vendor = await Vendor.findById(req.vendor);
  res.render("vendor/orderDetail", { vendor: vendor });
};
exports.completedOrder = async (req, res) => {
  const vendor = await Vendor.findById(req.vendor);
  res.render("vendor/completedOrder", { vendor: vendor });
  const orders = await Order.find({ vendor: req.vendor });
  const listOfOrders = [];
  // console.log(orders);
  for (var i = 0; i < orders.length; i++) {
    if (orders[i] == "Cancelled") {
      listOfOrders.push(orders[i]);
    }
  }
  res.render("vendor/cancelledOrder");
};

exports.editProfile = async (req, res) => {
  const vendor = await Vendor.findById(req.vendor);
  // console.log(req.file.size);
  // console.log(vendor.photo);
  // console.log(req.file);
  const hashPassword = await bcrypt.hash(req.body.password, 10);
  if (req.file == undefined) {
    // Find the document and update it
    Vendor.findOneAndUpdate(
      { _id: vendor.id }, // Specify the filter criteria to find the document
      {
        $set: {
          name: req.body.name,
          address: req.body.address,
          password: hashPassword,
        },
      }, // Specify the update operation
      { new: true } // Set the option to return the updated document
    )
      .then((updatedDocument) => {
        // Handle the updated document
        res.redirect("/api/vendor/profile");
        // console.log(vendor);
      })
      .catch((error) => {
        // Handle any errors that occur
        console.error(error);
      });
  } else {
    //  Find the document and update it
    Vendor.findOneAndUpdate(
      { _id: vendor.id }, // Specify the filter criteria to find the document
      {
        $set: {
          name: req.body.name,
          address: req.body.address,
          photo: {
            data: fs.readFileSync(
              path.join(__dirname + "/../uploads/" + req.file.filename)
            ),
            contentType: "image/png",
          },
          password: hashPassword,
        },
      }, // Specify the update operation
      { new: true } // Set the option to return the updated document
    )
      .then((updatedDocument) => {
        // Handle the updated document
        res.redirect("/api/vendor/profile");
        // console.log(vendor);
      })
      .catch((error) => {
        // Handle any errors that occur
        console.error(error);
      });
  }
};
