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

const Customer = require("../models/customer");
const ErrorResponse = require("../utils/errorResponse");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
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
  res.redirect("/api/customer/homepage");
}

// Customer profile 
exports.customerProfile = async (req, res, next) => {
  const user = await Customer.findById(req.user);
  res.render('customer/profile', { user: user.toObject({ getters: true }) });
}

// Display the product's information
exports.productProfile = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  const vendor = await Vendor.findById(product.vendorId);
  res.render('customer/detail', {product: product, vendor: vendor});
};

// Display vendor's information 
exports.productVendor = async (req, res, next) => {
  const product = await Product.find({vendorId: req.params.id});
  const vendor = await Vendor.findById(req.params.id);
  res.render("customer/vendor-page", {vendor: vendor, products: product});
}

// Add product to customer's cart
exports.addToCart = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    const customer = await Customer.findById(req.user);

    // Check if product already exists in cart
    const existingCartItem = customer.cart.find(item => item.product.equals(req.params.id));
    // If product had been in customer's cart, plus one 
    if (existingCartItem) {
      existingCartItem.quantity += 1;
    } else { // Else add to customer's cart
      const newCartItem = { product: product, quantity: 1 };
      customer.cart.push(newCartItem);
    }

    await customer.save();
    res.redirect("/api/customer/cart");
  } catch (error) {
    next(error);
  }
};

// Display all product in customer's cart
exports.showCart = async (req,res,next) => {
  try {
    const products = [];
    var total = 0;
    const customer = await Customer.findById(req.user);
    /** 
     For every product in customer's cart, find the product's information and 
    append it to a list and also count the total of all items in cart
    **/
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

// Display all products that have in database
exports.showProduct = async (req,res) => {
  var featureProducts = [];
  console.log("connect");
  Product.find()
  .then(
    (products) => {
      /* 
        If the number of products in database are less than 8,
        it would display all the product else it would display only 8 products
      */
      if (products.length < 8) {
        res.render('customer/index', {products: products});
      } 
      else {
        for (var i = 0; i < 8; i++) {
          featureProducts.push(products[i])
        };
        res.render('customer/index', {products: featureProducts});
      }
    }
  )
  .catch((error) => {console.log(error.message)});
};

// Create order based on customer's cart
exports.createOrder = async (req,res) => {
  try {
    const products = [];
    const customer = await Customer.findById(req.user);
    // Using for loop to get the list of all products in customer's cart
    for (var i = 0; i< customer.cart.length; i++) {
      var product = await Product.findById(customer.cart[i].product);
      Object.assign(product, {quantity: customer.cart[i].quantity});
      products.push(product);
    };

    // After add all products into an array, delete all products in customer's cart
    for (var a = 0; a < customer.cart.length; a++) {
      customer.cart.remove(customer.cart[a]);
    }
    customer.save();

    // Function to split an array based on a key 
    let groupBy = (array, key) => {
      return array.reduce((result, obj) => {
         (result[obj[key]] = result[obj[key]] || []).push(obj);
         return result;
      }, {});
   };

  //  Split the product list based on vendor ID
  var splitOrder = groupBy(products, "vendorId");
  var numberOfVendor = Object.keys(splitOrder).length;
  
  // Using for loop for each array that based on vendor id
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
    // Create new order with random distribution hub
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

// Delete product in customer's cart
exports.deleteProduct = async (req,res) => {
  try {    
    // Fint the product in cart based on req.params.id
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

// Display all the products in customer's cart and divide it if there are products from 
// more than two vendors
exports.getCheckout = async (req,res) => {
  try {
    const products = [];
    const listOfOrder = [];
    var total = 0;
    const customer = await Customer.findById(req.user);
    // Using for loop to get the list of all products in customer's cart
    for (var i = 0; i< customer.cart.length; i++) {
      var product = await Product.findById(customer.cart[i].product);
      Object.assign(product, {quantity: customer.cart[i].quantity});
      products.push(product);
      total += product.quantity * product.price;
    };

    // Function to split an array based on a key 
    let groupBy = (array, key) => {
      return array.reduce((result, obj) => {
         (result[obj[key]] = result[obj[key]] || []).push(obj);
         return result;
      }, {});
   };

    //  Split the product list based on vendor ID
   var splitOrder = groupBy(products, "vendorId");
   var numberOfVendor = Object.keys(splitOrder).length;
  
  // Using for loop for each array that based on vendor id
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
      // Add all products from that vendor in to a list
      listOfItems.push(items);
    }
    listOfOrder.push(listOfItems);
  }

  res.render('customer/checkout', {customer: customer, orders: listOfOrder, total: total});
  } catch (error) {
    console.log(error.message);
  }
};

// Edit profile for customer
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

// Display a contact page
exports.getContact = (req,res) => {
  res.render("customer/contact");
};

exports.getProduct = (req,res) => {
  res.render("customer/detail"); // Render the "detail" view for the customer's product
};

exports.getSignin = (req,res) => {
  res.render("customer/login"); // Render the "login" view for the customer's sign-in
};

exports.getSignup = (req,res) => {
  res.render("customer/signup"); // Render the "signup" view for the customer's sign-up
};

exports.getShop = (req,res) => {
  Product.find()
  .then(
    (products) => {
        res.render('customer/shop', {products: products});  // Render the "shop" view and pass the retrieved products data
    }
  )
  .catch((error) => {console.log(error.message)}); // Log any errors that occurred during the Product retrieval
};


exports.getOrderHistory = async (req,res) => {
  const customer = await Customer.findById(req.user); // Retrieve the customer based on the provided user ID
  const order = await Order.find({customer: customer.id}); // Find the orders associated with the customer
  res.render("customer/order", {customer: customer, orders: order}); // Render the "order" view and pass the retrieved customer and order data
};

exports.getChangePassword = async (req,res) => {
  const customer = await Customer.findById(req.user); // Retrieve the customer based on the provided user ID
  res.render("customer/security", {customer: customer}); // Render the security page
};

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

//user order status
exports.getCustomerOrderStatus = (req,res) => {
  res.render("customer/order-status");
}

//user security
exports.getCustomerSecurity = (req,res) => {
  res.render("customer/security");
};

// Change password or customer
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

// Filter the product by category
exports.getClothing = (req,res) => {
  Product.find()
  .then((products) => {
    var clothing = [];
    for (var i = 0; i< products.length; i++) {
      // Check if the product's category fit with the category
      if (products[i].category == "Clothing") {
        clothing.push(products[i]);
      }
    };
    var category = "Clothing"
    res.render("customer/category", {products: clothing, category: category});
  })
}

// Filter the product by category
exports.getElectronic = (req,res) => {
  Product.find()
  .then((products) => {
    var electronic = [];
    for (var i = 0; i< products.length; i++) {
      // Check if the product's category fit with the category
      if (products[i].category == "Electronic") {
        electronic.push(products[i]);
      }
    };
    var category = "Electronic"
    res.render("customer/category", {products: electronic, category: category});
  })
}

// Filter the product by category
exports.getBook = (req,res) => {
  Product.find()
  .then((products) => {
    var book = [];
    for (var i = 0; i< products.length; i++) {
      // Check if the product's category fit with the category
      if (products[i].category == "Book") {
        book.push(products[i]);
      }
    };
    var category = "Book"
    res.render("customer/category", {products: book, category: category});
  })
}

// Search product based on name and category
exports.searchProduct = async (req, res) => {
  const search = req.query.query;
  console.log(search);
  let data = await Product.find({
    "$or": [
      {name: {$regex: search}},
      {category: {$regex: search}}
    ]
  })
  // Use the 'key' variable for further processing
  res.render("customer/shop", {products: data, search: search});
};

// Filter product by min and max price
exports.filterByPrice = async (req,res) => {
  const minPrice = parseInt(req.params.min);
  const maxPrice = parseInt(req.params.max);
  Product.find()
  .then((products) => {
    var listOfProducts = [];
    for (var i = 0; i<products.length; i++) {
      // Check if the product's price in the min-max range
      if (products[i].price >= minPrice && products[i].price <= maxPrice) {
        listOfProducts.push(products[i]);
        
      }
    }
    res.render("customer/shop", {products: listOfProducts});
  })
}

// Delete the product quantity in customer's cart
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

// Display the order detail 
exports.getOrder = async (req,res) => {
  const customer = await Customer.findById(req.user);
  const order = await Order.findById(req.params.id);
  for (var i = 0; i< order.products.length; i++) {
    var product = await Product.findById(order.products[i].product);
    Object.assign(order.products[i], {productName: product.name});
    Object.assign(order.products[i], {productPrice: product.price});
    Object.assign(order.products[i], {productPhoto: product.photo});
  }
  res.render("customer/order-status", {customer: customer, order: order});
};

