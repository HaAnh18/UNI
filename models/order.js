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

const mongoose = require('mongoose');

// Create a schema for order
const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer' 
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vendor' 
  },
  shipper: {
    type: String,
    default: ""
  },
  total: {
    type: Number,
  },
  status: {
    type: String,
  },
  products: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product' 
      },
      quantity: {
        type: Number, 
      },
    }
  ],
  distribution: {
    type: String,
  }
});

module.exports = mongoose.model("Order", orderSchema);