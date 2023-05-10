const Customer = require("../models/customer");
const customer = require("../models/customer");
const ErrorResponse = require("../utils/errorResponse");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const flash = require('connect-flash');

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

  // const {username} = req.body;
  // const customerExist = await Customer.findOne({username});

  // if (customerExist) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Username already exists"
  //   })
  // }


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
      cart: []
    };
  
    Customer.create(data);

    // console.log(data);
    // res.status(201).json({
    //   success: true,
    //   data
    // })

    res.redirect('/api/customer/signin');

    // generateToken(customer, 200, res);
     
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
      // return res.status(400).json({
      //   success: false,
      //   message: "Username and password are required"
      // })
      flash('error', 'Please enter your username and password');
      return res.redirect('/api/customer/signin');
      // return req.flash("wrong");
    }

    // CHECK USERNAME
    const customer = await Customer.findOne({username: info.username});
    if (!customer) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      })
      // return next(new ErrorResponse(`Invalid credentials`, 400));
    };

    // VERIFY CUSTOMER'S PASSWORD
    const isMatched = await customer.comparePassword(info.password);
    if (!isMatched) {
      // return res.status(400).json({
      //   success: false,
      //   message: "Invalid credentials"
      // });
      return res.redirect('/api/customer/signin');
      // return next(new ErrorResponse(`Invalid credentials`, 400));
    } 
    

    // console.log(req.user);
    generateToken(customer, 200, res);
    // res.json(req.cookie)
    // res.redirect('/profile');

  } catch (error) {
    console.log(error);
    next(new ErrorResponse(`Cannot log in, check your credentials`, 400));
  }

  
}



const generateToken = async (customer, statusCode, res) => {

  const token = await customer.jwtGenerateToken();

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

exports.getMe = async (req, res, next) => {
  const customer = await Customer.findById(req.userId);
  console.log(customer);
}

// CUSTOMER PROFILE 
exports.customerProfile = async (req, res, next) => {
  const user = await Customer.findById(req.user);
  // res.status(200).json({
  //   success: true,
  //   user
  // })
  // const base64Image = 'data:user.photo;base64'; // your base64 image data here
  // res.send(user.photo);
  res.render('profile', { user: user.toObject({ getters: true }) });
}