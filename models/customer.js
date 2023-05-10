const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const customerSchema = new mongoose.Schema({
  username: {
    type: String, 
    trim: true,
    required: [true, 'Please add a username'],
    maxLength: 15,
    unique: true
  },
  password: {
    type: String, 
    trim: true,
    required: [true, 'Please add a password'],
    minLength: [6, 'Password must have at least six(6) characters'],
    match: [
      /^(?=.*\d)(?=.*[@#\-_$%^&+=§!\?])(?=.*[a-z])(?=.*[A-Z])[0-9A-Za-z@#\-_$%^&+=§!\?]+$/,
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and a special characters'
    ]
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  name: {
    type: String,
    trim: true,
    required: [true, 'Please add a name'],
    maxLength: 15,
  },
  address: {
    type: String,
    trim: true,
    required: [true, 'Please add an address'],
    maxLength: 15,
  },
  cart: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product' 
      },
      quantity: { 
        type: Number, 
        default: 1 }
    }
  ]


}, {timestamps: true});

// ENCRYPTING PASSWORD BEFORE SAVING
customerSchema.pre('save', async function(next){

  // ONLY HASH THE PASSWORD IF IT HAS BEEN MODIFIED (OR IS NEW)
  if (!this.isModified('password')) {
    next();
  };

  await bcrypt.hash(this.password,10)
  .then(hash => this.password = hash)
  .catch(err => console.error(err.message));

  // this.password = await bcrypt.hash(this.password, 10);
});

// VERIFY PASSWORD
customerSchema.methods.comparePassword = async function(yourPassword){
  return await bcrypt.compare(yourPassword, this.password);
};

// GET THE TOKEN
customerSchema.methods.jwtGenerateToken = function(){
  return jwt.sign({id: this.id}, process.env.JWT_SECRET, {
    expiresIn: 3600
  });
}

module.exports = mongoose.model("Customer", customerSchema);