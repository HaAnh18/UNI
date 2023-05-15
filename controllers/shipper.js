const Vendor = require("../models/vendor");
const Customer = require("../models/customer");
const Shipper = require("../models/shipper");
const ErrorResponse = require("../utils/errorResponse");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const shipper = require("../models/shipper");

 
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
      distributionHub: req.body.distributionHub
    };

    res.json(data);

    // const shipperExist = await Shipper.findOne({username: data.username});
    // const usernameExistinCustomer = await Customer.findOne({username: data.username});
    // const usernameExistinVendor = await Vendor.findOne({username: data.username});

    // if (shipperExist || usernameExistinCustomer || usernameExistinVendor) {
    //   res.status(400).json({
    //     success: false,
    //     message: "Username already exists"
    //   })
    // }
  
    Shipper.create(data);

    // console.log(data);
    // res.status(201).json({
    //   success: true,
    //   data
    // })

    // res.redirect('/api/vendor/signin');

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
    const shipper = await Shipper.findOne({username: info.username});
    if (!shipper) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      })
      // return next(new ErrorResponse(`Invalid credentials`, 400));
    };

    // VERIFY CUSTOMER'S PASSWORD
    const isMatched = await shipper.comparePassword(info.password);
    if (!isMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
      // res.redirect('/signin');
      // return next(new ErrorResponse(`Invalid credentials`, 400));
    } 
    

    // console.log(req.user);
    generateToken(shipper, 200, res);
    // res.json(req.cookie)
    // res.redirect('/profile');

  } catch (error) {
    console.log(error);
    next(new ErrorResponse(`Cannot log in, check your credentials`, 400));
  }
}



const generateToken = async (vendor, statusCode, res) => {

  const token = await shipper.jwtGenerateToken();

  const options = {
    httpOnly: true,
    expiresIn: new Date(Date.now() + process.env.EXPIRE_TOKEN)
  };

  res
  .status(statusCode)
  .cookie('token', token, options)
  .json({success: true, token})
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
exports.shipperProfile = async (req, res, next) => {
  const shipper = await Shipper.findById(req.shipper);
  // res.status(200).json({
  //   success: true,
  //   vendor
  // })
  res.render('profile-shipper', { shipper: shipper.toObject({ getters: true }) });
}



//frontend
exports.getSignin = (req,res) => {
  res.render("shipper/login_shipper");
};

exports.getSignup = (req,res) => {
  res.render("shipper/signup_shipper");
};

exports.getDashboard = (req,res) => {
  res.render("shipper/shipper_dashboard");
};

exports.getOrder = (req,res) => {
  res.render("shipper/order_detail");
};

exports.getEditProfile = (req,res) => {
  res.render("shipper/edit_profile");
};