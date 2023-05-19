const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const vendorSchema = new mongoose.Schema({
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
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  name: {
    type: String,
    trim: true,
    required: [true, 'Please add a name'],
    maxLength: 15
  },
  address: {
    type: String,
    trim: true,
    required: [true, 'Please add an address'],
    maxLength: 15,
    unique: true
  },


}, {timestamps: true});

// ENCRYPTING PASSWORD BEFORE SAVING
vendorSchema.pre('save', async function(next){

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
vendorSchema.methods.comparePassword = async function(yourPassword){
  return await bcrypt.compare(yourPassword, this.password);
};

// GET THE TOKEN
vendorSchema.methods.jwtGenerateToken = function(){
  return jwt.sign({id: this.id}, process.env.JWT_SECRET, {
    expiresIn: 3600
  });
}

module.exports = mongoose.model("Vendor", vendorSchema);