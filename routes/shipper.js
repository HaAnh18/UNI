const express = require('express');
const router = express.Router();
const shipper = require('../controllers/shipper');

router.get("/", shipper.getDashboard);

router.get("/signin", shipper.getSignin);

router.get("/signup", shipper.getSignup);

router.get("/order", shipper.getOrder);

router.get("/editprofile", shipper.getEditProfile);

module.exports = router;