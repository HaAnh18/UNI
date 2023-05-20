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

const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  logout,
  getMe,
  handleFileUpload,
  vendorProfile,
  addProduct,
} = require("../controllers/vendor");
const { isAuthenticated } = require("../middlewares/auth-vendor");
const vendor = require("../controllers/vendor");

// router.get('/signup', (req,res)=>{
//   res.render("signup-vendor");
// })

router.get("/signup", vendor.getSignup);

router.post('/signup', vendor.handleFileUpload, vendor.signup);

router.post('/signin', vendor.signin);

router.get('/logout', vendor.logout);

// router.get('/signin', (req,res) => {
//   res.render('login-vendor');
// })

router.get("/signin", vendor.getLogin);

router.get('/addproduct', isAuthenticated, vendor.getAddProduct);

router.post(
  "/addproduct",
  isAuthenticated,
  vendor.handleFileUpload,
  vendor.addProduct
);

// router.get('/customer',verifyToken, getMe);
// router.get('/customer', verifyToken, getMe);
// Example usage:
// router.get('/customer', verifyToken, getMe);

//frontend
router.get("/dashboard", isAuthenticated, vendor.showDashboard);

router.get("/products", isAuthenticated, vendor.showProduct);

router.post('/editprofile', isAuthenticated, vendor.handleFileUpload, vendor.editProfile);

router.post('/:id/editproduct', isAuthenticated, vendor.handleFileUpload, vendor.editProduct);

router.get("/addproduct", isAuthenticated, vendor.getAddProduct);

router.get("/profile", isAuthenticated, vendor.vendorProfile);

router.get("/termService", isAuthenticated, vendor.termService);

router.get("/pendingorder", isAuthenticated, vendor.pendingOrder);

router.get("/activeorder", isAuthenticated, vendor.activeOrder);

router.get("/cancelledorder", isAuthenticated, vendor.cancelledOrder);

router.get("/product/:id", isAuthenticated, vendor.productDetail);

router.get("/completedorder", isAuthenticated, vendor.completedOrder);

router.get("/order/:id/changestatus", isAuthenticated, vendor.changeStatus);

router.post('/changepassword', isAuthenticated, vendor.changePassword);

router.get("/order/:id", isAuthenticated, vendor.getOrder);


module.exports = router;
