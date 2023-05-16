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

router.post("/signup", handleFileUpload, signup);

router.post("/signin", signin);

router.get("/logout", logout);

// router.get('/signin', (req,res) => {
//   res.render('login-vendor');
// })

router.get("/signin", vendor.getLogin);

router.get("/getme", isAuthenticated, vendorProfile);

router.get("/addproduct", isAuthenticated, vendor.getAddProduct);

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

router.get("/addproduct", isAuthenticated, vendor.getAddProduct);

router.get("/profile", isAuthenticated, vendor.vendorProfile);

router.get("/termService", isAuthenticated, vendor.termService);

router.get("/pendingOrder", isAuthenticated, vendor.pendingOrder);

router.get("/activeOrder", isAuthenticated, vendor.activeOrder);

router.get("/cancelledOrder", isAuthenticated, vendor.cancelledOrder);

router.get("/productDetail", isAuthenticated, vendor.productDetail);

module.exports = router;
