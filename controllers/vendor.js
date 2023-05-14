exports.showDashboard = async (req, res) => {
  res.render("vendor/vendor");
};

exports.showProduct = async (req, res) => {
  res.render("vendor/products");
};

exports.getLogin = async (req, res) => {
  res.render("vendor/login");
};

exports.getSignup = async (req, res) => {
  res.render("vendor/signup");
};

exports.getAddProduct = async (req, res) => {
  res.render("vendor/add-product");
};

exports.vendorProfile = async (req, res) => {
  res.render("vendor/profile");
};

exports.termService = async (req, res) => {
  res.render("vendor/termService");
};