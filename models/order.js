const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer' 
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vendor' 
  },
  total: {
    type: Number
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