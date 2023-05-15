exports.getHomepage = (req,res) => {
  res.render("customer/index");
};

exports.getCart = (req,res) => {
  res.render("customer/cart");
};

exports.getCheckout = (req,res) => {
  res.render("customer/checkout");
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
  res.render("users/signup");
};

exports.getShop = (req,res) => {
  res.render("customer/shop");
};

exports.customerProfile = (req,res) => {
  res.render("customer/profile");
};

exports.getOrderHistory = (req,res) => {
  res.render("customer/order");
};

exports.getChangePassword = (req,res) => {
  res.render("customer/security");
};