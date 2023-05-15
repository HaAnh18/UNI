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