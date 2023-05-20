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
const { isAuthenticated } = require("../middlewares/auth-vendor");
const vendor = require("../controllers/vendor");

// Route to get signup 
router.get("/signup", vendor.getSignup);

// Route to post signup
router.post('/signup', vendor.handleFileUpload, vendor.signup);

// Route to post signin
router.post('/signin', vendor.signin);

// Route to logout
router.get('/logout', vendor.logout);

// Route to get signin
router.get("/signin", vendor.getLogin);

// Route to get app product page
router.get('/addproduct', isAuthenticated, vendor.getAddProduct);

// Route to post add product
router.post(
  "/addproduct",
  isAuthenticated,
  vendor.handleFileUpload,
  vendor.addProduct
);

// Route to get dashboard
router.get("/dashboard", isAuthenticated, vendor.showDashboard);

// Route to get products
router.get("/products", isAuthenticated, vendor.showProduct);

// Route to edit profile
router.post('/editprofile', isAuthenticated, vendor.handleFileUpload, vendor.editProfile);

// Route to edit product
router.post('/:id/editproduct', isAuthenticated, vendor.handleFileUpload, vendor.editProduct);

// Route to get add product
router.get("/addproduct", isAuthenticated, vendor.getAddProduct);

// Route to get profile
router.get("/profile", isAuthenticated, vendor.vendorProfile);

// Route to get term service
router.get("/termService", isAuthenticated, vendor.termService);

// Route to get pending order
router.get("/pendingorder", isAuthenticated, vendor.pendingOrder);

// Route to get active order
router.get("/activeorder", isAuthenticated, vendor.activeOrder);

// Route to get cancelled order
router.get("/cancelledorder", isAuthenticated, vendor.cancelledOrder);

// Route to get product information
router.get("/product/:id", isAuthenticated, vendor.productDetail);

// Route to get completed order
router.get("/completedorder", isAuthenticated, vendor.completedOrder);

// Route to change order status
router.get("/order/:id/changestatus", isAuthenticated, vendor.changeStatus);

// Route to change password
router.post('/changepassword', isAuthenticated, vendor.changePassword);

// Route to get order detail
router.get("/order/:id", isAuthenticated, vendor.getOrder);

module.exports = router;
