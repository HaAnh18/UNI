const Customer = require("../models/customer");
const ErrorResponse = require("../utils/errorResponse");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const flash = require('connect-flash');
const Product = require("../models/product");
const Vendor = require("../models/vendor");
const Shipper = require("../models/shipper");
const Order = require("../models/order");

const { popupfunction } = require("../public/js/popupfunction");

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
      cart: []
    };

    const customerExist = await Customer.findOne({username: data.username});
    const usernameExistinShipper = await Shipper.findOne({username: data.username});
    const usernameExistinVendor = await Vendor.findOne({username: data.username});

  if (customerExist || usernameExistinShipper || usernameExistinVendor) {
    return res.status(400).json({
      success: false,
      message: "Username already exists"
    })
  }
  
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
  try {
    
    if (!info.username || !info.password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required"
      })
      // flash('error', 'Please enter your username and password');
      // return res.redirect('/api/customer/signin');
      // return res.render("signin", {message: "Please enter your username and password"})
      // return req.flash("wrong");
    }

    // CHECK USERNAME
    const customer = await Customer.findOne({username: info.username});
    if (!customer) {
      return popupfunction('invalid');
      // return res.status(400).json({
      //   success: false,
      //   message: "Invalid credentials"
      // })
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
  // .json({success: true, token})
  .redirect('/api/customer/homepage');
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
  res.render('customer/profile', { user: user.toObject({ getters: true }) });
}

exports.productProfile = async (req, res, next) => {
  const product = await Product.findById(req.params.id)
  // console.log(product.vendorId);
  const vendor = await Vendor.findById(product.vendorId);
  // console.log(vendor.name);
  res.render('customer/detail', {product: product, vendor: vendor});
  
};

exports.productVendor = async (req, res, next) => {
  const product = await Product.find({vendorId: req.params.id})
  const vendor = await Vendor.findById(req.params.id)
  
  res.render("customer/vendor-page", {vendor: vendor, products: product})
    // res.json(product);

}

exports.addToCart = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    const customer = await Customer.findById(req.user);

    // Check if product already exists in cart
    const existingCartItem = customer.cart.find(item => item.product.equals(req.params.id));
    if (existingCartItem) {
      existingCartItem.quantity += 1;
    } else {
      const newCartItem = { product: product, quantity: 1 };
      customer.cart.push(newCartItem);
    }

    await customer.save();
    // res.json(customer.cart);
    res.redirect("/api/customer/cart");
  } catch (error) {
    next(error);
  }
};

exports.showCart = async (req,res,next) => {
  try {
    const products = [];
    var total = 0;
    const customer = await Customer.findById(req.user);
    // console.log(customer.cart.length);
    for (var i = 0; i<customer.cart.length; i++) {
      // const abc = await Product.find({vendorId: req.params.id});
      // console.log(`${product}: ${customer.cart[product]}`)
      var product = await Product.findById(customer.cart[i].product);
      // console.log(customer.cart[i].product);
      // console.log("1" + product);
      // console.log(item.length);
      // cart.push(customer.cart[i])
      // product.push({quantity: customer.cart[i].quantity });
      // product["quantity"] = customer.cart.quantity;
      Object.assign(product, {quantity: customer.cart[i].quantity});
      products.push(product);
      total += product.quantity * product.price;
      // console.log(product.quantity);
      // console.log(product.quantity);
      // console.log(product.name);

      // console.log(`${names[index]} is at position ${index}`)
    }
    // console.log(products);
    res.render('customer/cart', {products: products, total: total});
    // console.log(customer.cart);
  } catch (error) {
    console.log(error.message);
  }
}

exports.showProduct = async (req,res) => {
  const featureProducts = [];
  Product.find()
  .then(
    (products) => {
      if (products.length <= 8) {
        res.render('customer/index', {products: products});
      } else {
        for (var i = 0; i< products.lenght; i++) {
          featureProducts.push(products[i])
        };
        res.render('customer/index', {products: featureProducts});
      }
    }
  )
  .catch((error) => {console.log(error.message)});
};

exports.createOrder = async (req,res) => {
    try {
      const products = [];
      var total = 0;
      const customer = await Customer.findById(req.user);
      for (var i = 0; i< customer.cart.length; i++) {
        var product = await Product.findById(customer.cart[i].product);
        Object.assign(product, {quantity: customer.cart[i].quantity});
        products.push(product);
        total += product.quantity * product.price;
        customer.cart.remove(customer.cart[i]);
      };

      let groupBy = (array, key) => {
        return array.reduce((result, obj) => {
           (result[obj[key]] = result[obj[key]] || []).push(obj);
           return result;
        }, {});
     };

     var splitOrder = groupBy(products, "vendorId");
     var numberOfVendor = Object.keys(splitOrder).length;
    
      for (var n = 0; n<numberOfVendor; n++) {
        var listOfItems = [];
      
        for (var m = 0; m<Object.values(splitOrder)[n].length; m++) {
          var items = { 
            productId: Object.values(splitOrder)[n][m].id, 
            quantity: Object.values(splitOrder)[n][m].quantity
          };
          listOfItems.push(items);
        }

        var orderInfo = {
          customer: customer.id,
          vendor: Object.keys(splitOrder)[n],
          total: total,
          products: listOfItems,
        }

        Order.create(orderInfo);
      }
    } catch (error) {
    console.log(error.message);
  }
}

exports.deleteProduct = async (req,res) => {
  try {    
    const customer = await Customer.findById(req.user);
    // console.log(customer);
    for (var i = 0; i<customer.cart.length; i++) {
      if (customer.cart[i].product == req.params.id) {
        customer.cart.remove(customer.cart[i]);
      }
    }
    customer.save();
    res.redirect("/api/customer/cart")
    // console.log(total);
    // res.render('customer/cart', {products: products, total: total});
    // console.log(customer.cart);
  } catch (error) {
    console.log(error.message);
  }
}


//frontend
// exports.getHomepage = (req,res) => {
//   res.render("customer/index");
// };

// exports.getCart = (req,res) => {
//   res.render("customer/cart");
// };

exports.getCheckout = async (req,res) => {
  try {
    const products = [];
    const listOfOrder = [];
    var total = 0;
    const customer = await Customer.findById(req.user);
    for (var i = 0; i< customer.cart.length; i++) {
      var product = await Product.findById(customer.cart[i].product);
      Object.assign(product, {quantity: customer.cart[i].quantity});
      products.push(product);
      total += product.quantity * product.price;
    };

    let groupBy = (array, key) => {
      return array.reduce((result, obj) => {
         (result[obj[key]] = result[obj[key]] || []).push(obj);
         return result;
      }, {});
   };

   var splitOrder = groupBy(products, "vendorId");
   var numberOfVendor = Object.keys(splitOrder).length;
  //  console.log(numberOfVendor);
  
  for (var n = 0; n<numberOfVendor; n++) {
    var listOfItems = [];
    // console.log(Object.keys(splitOrder)[n]);
    var vendor = await Vendor.findById(Object.keys(splitOrder)[n]);
    for (var m = 0; m<Object.values(splitOrder)[n].length; m++) {
      var items = { 
        product: Object.values(splitOrder)[n][m].name, 
        vendor: vendor.name,
        price: Object.values(splitOrder)[n][m].price,
        quantity: Object.values(splitOrder)[n][m].quantity
      };
      listOfItems.push(items);
    }
    listOfOrder.push(listOfItems);
  }
  console.log(listOfOrder.length);

  res.render('customer/checkout', {customer: customer, orders: listOfOrder, total: total});
  } catch (error) {
    console.log(error.message);
  }
};

exports.getContact = (req,res) => {
  res.render("customer/contact");
};

exports.getProduct = (req,res) => {
  res.render("customer/detail");
};

exports.getSignin = (req,res) => {
  res.render("customer/login");
};

exports.getSignup = (req,res) => {
  res.render("customer/signup");
};

exports.getShop = (req,res) => {
  Product.find()
  .then(
    (products) => {
        res.render('customer/shop', {products: products});
    }
  )
  .catch((error) => {console.log(error.message)});
};

// exports.customerProfile = (req,res) => {
//   res.render("customer/profile");
// };

exports.getOrderHistory = (req,res) => {
  res.render("customer/order");
};

exports.getChangePassword = (req,res) => {
  res.render("customer/security");
};

/*====================================================Customer route======================================================*/
//about us
exports.getCustomerAboutUs = (req,res) => {
  res.render("customer/about");
}
//contact
exports.getCustomerContact = (req,res) => {
  res.render("customer/contact");
}
//faq
exports.getCustomerFaq = (req,res) => {
  res.render("customer/faq");
}

//login & signup
exports.getCustomerLogin = (req,res) => {
  res.render("customer/login");
}

//homepage(index)
//already route above

//shop
exports.getCustomerShop = (req,res) => {
  res.render("customer/shop");
}

//shop
exports.getCustomerCategories = (req,res) => {
  res.render("customer/categories");
}

//shop detail
//already route above

//cart
exports.getCustomerCart = (req,res) => {
  res.render("customer/cart");
}

//checkout
exports.getCustomerCheckout = (req,res) => {
  res.render("customer/checkout");
}

//user profile
exports.getCustomerProfile = async (req,res) => {
  const customer = await Customer.findById(req.user);
  res.render("customer/profile", {user: customer});
}

//user order
exports.getCustomerOrder = (req,res) => {
  res.render("customer/order");
}

//user order status
exports.getCustomerOrderStatus = (req,res) => {
  res.render("customer/order-status");
}

//user security
exports.getCustomerSecurity = (req,res) => {
  res.render("customer/security");
}

