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

// Create schema for product
const productSchema = new mongoose.Schema({
  category: {
      type: String,
      enum: ['Clothing', 'Book', 'Electronic']
  },
  name: {
    type: String
  },
  price: {
    type: Number,
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  description: {
    type: String,
    maxLength: 500
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vendor' 
  }
}, {timestamps: true})

module.exports = mongoose.model("Product", productSchema);

