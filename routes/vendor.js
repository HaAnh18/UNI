const express = require("express");
const router = express.Router();
const vendor = require("../controllers/vendor");

router.get("/", vendor.showDashboard);

router.get("/products", vendor.showProduct);

router.get("/login", vendor.getLogin);

router.get("/signup", vendor.getSignup);

router.get("/addproduct", vendor.getAddProduct);

router.get("/profile", vendor.vendorProfile);

router.get("/termService", vendor.termService);

router.get("/pendingOrder", vendor.pendingOrder);

router.get("/activeOrder", vendor.activeOrder);

router.get("/cancelledOrder", vendor.cancelledOrder);

module.exports = router;
