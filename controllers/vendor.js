const Vendor = require("../models/vendor");
const Customer = require("../models/customer");
const ErrorResponse = require("../utils/errorResponse");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Product = require("../models/product");

 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
var upload = multer({ storage: storage });

exports.handleFileUpload = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
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
        data: fs.readFileSync(path.join(__dirname + '/../uploads/' + req.file.filename)),
        contentType: 'image/png'
      },
      name: req.body.name,
      address: req.body.address,
    };


    const vendorExist = await Vendor.findOne({username: data.username});
    const usernameExist = await Customer.findOne({username: data.username});
    const addressExist = await Vendor.findOne({address: data.address});

    if (vendorExist || usernameExist) {
      res.status(400).json({
        success: false,
        message: "Username already exists"
      })
    }

    if (addressExist) {
      return res.status(400).json({
        success: false,
        message: "Address already exists"
      }) 
    }
  
    Vendor.create(data);

    // console.log(data);
    // res.status(201).json({
    //   success: true,
    //   data
    // })

    res.redirect('/api/vendor/signin');

    // generateToken(vendor, 200, res);
     
  } catch(error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message
    })
    next(error);
  }
}

exports.signin = async (req, res, next) => {
  var info = {
    username: req.body.username,
    password: req.body.password
  }
  // res.json(info.username);
  try {
    // const {username, password} = req.body;
    
    if (!info.username || !info.password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required"
      })
      // return req.flash("wrong");
    }

    // CHECK USERNAME
    const vendor = await Vendor.findOne({username: info.username});
    if (!vendor) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      })
      // return next(new ErrorResponse(`Invalid credentials`, 400));
    };

    // VERIFY CUSTOMER'S PASSWORD
    const isMatched = await vendor.comparePassword(info.password);
    if (!isMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
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
}



const generateToken = async (vendor, statusCode, res) => {

  const token = await vendor.jwtGenerateToken();

  const options = {
    httpOnly: true,
    expiresIn: new Date(Date.now() + process.env.EXPIRE_TOKEN)
  };

  res
  .status(statusCode)
  .cookie('token', token, options)
  // .json({success: true, token})
  .redirect("/api/vendor/dashboard")
  // console.log(({success: true, token}))
}

// LOG OUT USER
exports.logout = (req, res, next) => {
  res.clearCookie('token');
  res.status(200).json({
    success: true,
    message: "Logged out"
  })
}

// exports.getMe = async (req, res, next) => {

//   try {
//     const customer = await Customer.findById(req.user.id);
//     res.status(200).json({
//       success: true,
//       customer
//     })
     
//   } catch(error) {
//     next(error);
//   }
// }

// exports.getMe = asyncHandler(async (req, res, next) => {
// 	const customer = await Customer.findById(req.user.id);

// 	res.status(200).json({
// 		success: true,
// 		data: customer,
// 	});
// });

// exports.getMe = async (req, res, next) => {
//   const vendor = await Vendor.findById(req.userId);
//   console.log(vendor);
// }

// CUSTOMER PROFILE 
exports.vendorProfile = async (req, res, next) => {
  const vendor = await Vendor.findById(req.vendor);
  // res.status(200).json({
  //   success: true,
  //   vendor
  // })
  // res.render('profile-vendor', { vendor: vendor.toObject({ getters: true }) });
  res.json(vendor);
}

exports.addProduct = async (req, res, next) => {
  try {
    var productInfo = {
      category: req.body.category,
      name: req.body.name,
      price: req.body.price,
      photo: {
        data: fs.readFileSync(path.join(__dirname + '/../uploads/' + req.file.filename)),
        contentType: 'image/png'
      },
      description: req.body.description,
      vendorId: req.vendor
    }

    // console.log(productInfo);

    Product.create(productInfo);
    res.redirect("/api/vendor/products");
    // res.json(productInfo);
    // console.log(productInfo);
  
  } catch (error) {
    console.log(error.message);
  }
}





//frontend
exports.showDashboard = async (req, res) => {
  const vendor = await Vendor.findById(req.vendor);
  res.render("vendor/vendor", {vendor: vendor});
};

exports.showProduct = async (req, res) => {
  const vendor = await Vendor.findById(req.vendor);
  const products = await Product.find({vendorId: vendor.id});
  // console.log(products);
  res.render("vendor/products", {vendor: vendor, products: products});
};

exports.getLogin = async (req, res) => {
  res.render("vendor/login");
};

exports.getSignup = async (req, res) => {
  res.render("vendor/signup");
};

exports.getAddProduct = async (req, res) => {
  const vendor = await Vendor.findById(req.vendor);
  res.render("vendor/add-product", {vendor: vendor});
};

exports.vendorProfile = async (req, res) => {
  const vendor = await Vendor.findById(req.vendor);
  res.render("vendor/profile", {vendor: vendor});
};

exports.termService = async (req, res) => {
  res.render("vendor/termService");
};

exports.pendingOrder = async (req, res) => {
  res.render("vendor/pendingOrder");
};

exports.activeOrder = async (req, res) => {
  res.render("vendor/activeOrder");
};

exports.cancelledOrder = async (req, res) => {
  res.render("vendor/cancelledOrder");
};
