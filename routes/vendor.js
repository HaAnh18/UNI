const express = require("express");
const router = express.Router();
const vendor = require("../controllers/vendor");

router.get("/", vendor.showDashboard);

router.get("/products", vendor.showProduct);

router.get("/signin", vendor.getSignin);

router.get("/signup", vendor.getSignup);

router.get("/addproduct", vendor.getAddProduct);

router.get("/profile", vendor.vendorProfile);

router.get("/termService", vendor.termService);

module.exports = router;
