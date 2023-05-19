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
const bcrypt = require("bcryptjs");

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
      name: req.body.name,
      address: req.body.address,
      cart: []
    };

    // Check if the username already exists in any of the collections (Customer, Shipper, Vendor)
    const customerExist = await Customer.findOne({username: data.username});
    const usernameExistinShipper = await Shipper.findOne({username: data.username});
    const usernameExistinVendor = await Vendor.findOne({username: data.username});

    // If the username had beed existed, display a message
    if (customerExist || usernameExistinShipper || usernameExistinVendor) {
      return res.render("customer/login", {message: "Username already exists"});
    }

    // Create a customer's document in mongodb
    Customer.create(data);

    res.redirect('/api/customer/signin'); // Redirect user to the signin page

  } catch(error) { // If it catches bug, it will console the error
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message
    })
    next(error);
  }
}

// Export a function for customer to sign in
exports.signin = async (req, res, next) => {
  try {
    // Get the data from the sign in form
    var info = {
      username: req.body.username,
      password: req.body.password
    }

    // Check if all fields are filled 
    if (!info.username || !info.password) {
      const message = "Please enter your username and password";
      return res.render("customer/login", {message: message})
    }

    // Check username is correct or not
    const customer = await Customer.findOne({username: info.username});
    if (!customer) {
      return res.render("customer/login", {message: "Invalid credentials"})
    };

    // Verify customer;s password
    const isMatched = await customer.comparePassword(info.password);
    if (!isMatched) {
      return res.render("customer/login", {message: "Invalid credentials"})
    } 
    
    // Generate a token for customer
    generateToken(customer, 200, res);

  } catch (error) { // Console a error if it has bug
    console.log(error);
    next(new ErrorResponse(`Cannot log in, check your credentials`, 400));
  }
}

// Generate token function
const generateToken = async (customer, statusCode, res) => {
  // Generate a JSON Web Token (JWT) for the customer
  const token = await customer.jwtGenerateToken();

  // Configure options for the token cookie
  const options = {
    httpOnly: true, // The cookie cannot be accessed by client-side JavaScript
    expiresIn: new Date(Date.now() + process.env.EXPIRE_TOKEN) // Set the expiration date for the cookie
  };

  // Set the status code of the response and add the token cookie
  res
  .status(statusCode)
  .cookie('token', token, options)
  .redirect('/api/customer/homepage');
}

// Log out user
exports.logout = (req, res, next) => {
  res.clearCookie('token');
  // res.status(200).json({
  //   success: true,
  //   message: "Logged out"
  // })
  res.redirect("/api/customer/homepage");
}

// CUSTOMER PROFILE 
exports.customerProfile = async (req, res, next) => {
  const user = await Customer.findById(req.user);
  res.render('customer/profile', { user: user.toObject({ getters: true }) });
}

exports.productProfile = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  const vendor = await Vendor.findById(product.vendorId);
  res.render('customer/detail', {product: product, vendor: vendor});
};

exports.productVendor = async (req, res, next) => {
  const product = await Product.find({vendorId: req.params.id});
  const vendor = await Vendor.findById(req.params.id);
  res.render("customer/vendor-page", {vendor: vendor, products: product});
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
    for (var i = 0; i<customer.cart.length; i++) {
      var product = await Product.findById(customer.cart[i].product);
      Object.assign(product, {quantity: customer.cart[i].quantity});
      products.push(product);
      total += product.quantity * product.price;
    }
    res.render('customer/cart', {products: products, total: total});
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
    const customer = await Customer.findById(req.user);
    for (var i = 0; i< customer.cart.length; i++) {
      var product = await Product.findById(customer.cart[i].product);
      Object.assign(product, {quantity: customer.cart[i].quantity});
      products.push(product);
    };

    for (var a = 0; a < customer.cart.length; a++) {
      customer.cart.remove(customer.cart[a]);
    }
    customer.save();

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
    var eachTotal = 0;
    for (var m = 0; m<Object.values(splitOrder)[n].length; m++) {
      var items = { 
        product: Object.values(splitOrder)[n][m].id, 
        quantity: Object.values(splitOrder)[n][m].quantity
      };
      eachTotal += Object.values(splitOrder)[n][m].price * items.quantity;
      listOfItems.push(items);
    }
 
    var distributionHub = ['hubA', 'hubB', 'hubC', 'hubD'];
    var orderInfo = {
          customer: customer.id,
          vendor: Object.keys(splitOrder)[n],
          total: eachTotal,
          status: "Pending",
          products: listOfItems,
          distribution: distributionHub[(Math.floor(Math.random() * distributionHub.length))],
    }
    
    Order.create(orderInfo);
  }
  res.redirect("/api/customer/orderhistory");
  } catch (error) {
    console.log(error.message);
  }
}

exports.deleteProduct = async (req,res) => {
  try {    
    const customer = await Customer.findById(req.user);
    for (var i = 0; i<customer.cart.length; i++) {
      if (customer.cart[i].product == req.params.id) {
        customer.cart.remove(customer.cart[i]);
      }
    }
    customer.save();
    res.redirect("/api/customer/cart")
  } catch (error) {
    console.log(error.message);
  }
}

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
  
  for (var n = 0; n<numberOfVendor; n++) {
    var listOfItems = [];
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

  res.render('customer/checkout', {customer: customer, orders: listOfOrder, total: total});
  } catch (error) {
    console.log(error.message);
  }
};

exports.editProfile = async (req,res) => {
  const customer = await Customer.findById(req.user);
 // Find the document and update it
  Customer.findOneAndUpdate(
  { _id: customer.id}, // Specify the filter criteria to find the document
  { $set: { 
    name: req.body.name,
    address: req.body.address
  } }, // Specify the update operation
  { new: true } // Set the option to return the updated document
)
  .then(updatedDocument => {
    // Handle the updated document
    res.redirect('/api/customer/profile');
  })
  .catch(error => {
    // Handle any errors that occur
    console.error(error);
  });
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


exports.getOrderHistory = async (req,res) => {
  const customer = await Customer.findById(req.user);
  const order = await Order.find({customer: customer.id});
  res.render("customer/order", {customer: customer, orders: order});
};

exports.getChangePassword = async (req,res) => {
  const customer = await Customer.findById(req.user);
  res.render("customer/security", {customer: customer});
};

/*====================================================Customer route======================================================*/
//about us
exports.getCustomerAboutUs = (req,res) => {
  res.render("customer/about");
};
//contact
exports.getCustomerContact = (req,res) => {
  res.render("customer/contact");
};
//faq
exports.getCustomerFaq = (req,res) => {
  res.render("customer/faq");
};

//cart
exports.getCustomerCart = (req,res) => {
  res.render("customer/cart");
};

//checkout
exports.getCustomerCheckout = (req,res) => {
  res.render("customer/checkout");
};

//user profile
exports.getCustomerProfile = async (req,res) => {
  const customer = await Customer.findById(req.user);
  res.render("customer/profile", {user: customer});
};

exports.getOrderStatus = async (req,res) => {
  const customer = await Customer.findById(req.user);
  const order = await Order.findById(req.params.id);
  res.render("customer/order-status", {user: customer, order: order});
}

//user order status
exports.getCustomerOrderStatus = (req,res) => {
  res.render("customer/order-status");
}

//user security
exports.getCustomerSecurity = (req,res) => {
  res.render("customer/security");
};

exports.changePassword = async (req,res) => {
  const customer = await Customer.findById(req.user);
  const hashPassword = bcrypt.hash(req.body.new, 10);
  const isMatched = await customer.comparePassword(req.body.current);
  if (isMatched) {
    Customer.findOneAndUpdate(
      { _id: customer.id }, // Specify the filter criteria to find the document
      { $set: { password: hashPassword } }, // Specify the update operation
      { new: true } // Set the option to return the updated document
    )
      .then(updatedDocument => {
        // Handle the updated document
        res.redirect('/api/customer/profile');
      })
      .catch(error => {
        // Handle any errors that occur
        console.error(error);
      });
  } else {
    res.render('customer/security', {message: "Wrong password", customer: customer})
  }
 
}

exports.getClothing = (req,res) => {
  Product.find()
  .then((products) => {
    var clothing = [];
    for (var i = 0; i< products.length; i++) {
      if (products[i].category == "clothing") {
        clothing.push(products[i]);
      }
    };
    var category = "Clothing"
    res.render("customer/category", {products: clothing, category: category});
  })
}

exports.getElectronic = (req,res) => {
  Product.find()
  .then((products) => {
    var electronic = [];
    for (var i = 0; i< products.length; i++) {
      if (products[i].category == "electronic") {
        electronic.push(products[i]);
      }
    };
    var category = "Electronic"
    res.render("customer/category", {products: electronic, category: category});
  })
}

exports.getBook = (req,res) => {
  Product.find()
  .then((products) => {
    var book = [];
    for (var i = 0; i< products.length; i++) {
      if (products[i].category == "book") {
        book.push(products[i]);
      }
    };
    var category = "Book"
    res.render("customer/category", {products: book, category: category});
  })
}

exports.searchProduct = async (req, res) => {
  const search = req.query.query;
  console.log(search);
  let data = await Product.find({
    "$or": [
      {name: {$regex: search}},
      {category: {$regex: search}}
    ]
  })
  // console.log(data);
    // Use the 'key' variable for further processing
  console.log(search);
  res.render("customer/shop", {products: data, search: search});
};

exports.filterByPrice = async (req,res) => {
  const minPrice = parseInt(req.params.min);
  const maxPrice = parseInt(req.params.max);
  Product.find()
  .then((products) => {
    var listOfProducts = [];
    for (var i = 0; i<products.length; i++) {
      if (products[i].price >= minPrice && products[i].price <= maxPrice) {
        listOfProducts.push(products[i]);
        
      }
    }
    res.render("customer/shop", {products: listOfProducts});
  })
}

exports.deleteProductQuantity = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.user);

    const existingCartItem = customer.cart.find(item => item.product.equals(req.params.id));
    existingCartItem.quantity -= 1;
    
    await customer.save();
    res.redirect("/api/customer/cart");
  } catch (error) {
    next(error);
  }
};

