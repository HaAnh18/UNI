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
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const shipperSchema = new mongoose.Schema({
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
  distributionHub: {
    type: String,
    enum: ['hubA', 'hubB', 'hubC', 'hubD']
  }
  
}, {timestamps: true});

// ENCRYPTING PASSWORD BEFORE SAVING
shipperSchema.pre('save', async function(next){

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
shipperSchema.methods.comparePassword = async function(yourPassword){
  return await bcrypt.compare(yourPassword, this.password);
};

// GET THE TOKEN
shipperSchema.methods.jwtGenerateToken = function(){
  return jwt.sign({id: this.id}, process.env.JWT_SECRET, {
    expiresIn: 3600
  });
}

module.exports = mongoose.model("Shipper", shipperSchema);