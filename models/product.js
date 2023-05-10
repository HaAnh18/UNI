const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  category: {
    type: String
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

