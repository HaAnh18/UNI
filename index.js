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

const path = require('path');
const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require("cookie-parser");
const session = require('express-session');


// IMPORT ROUTES
const userRoute = require("./routes/customer");
const vendorRoute = require("./routes/vendor");
const shipperRoute = require("./routes/shipper");

// CONNECT DATABASE
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
.then(() => console.log('DB connected'))
.catch((err) => console.log(err));

const templatePath = path.join(__dirname, './views');
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", templatePath); 
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));


// MIDDLEWARE
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
}))

module.exports = path.dirname(require.main.filename);
app.use(express.static(path.join(__dirname, "public"))); // Serve static files
// Call bootstrap css file with class path
app.use(
  "/css",
  express.static(
    path.join(__dirname, "node_modules", "bootstrap", "dist", "css")
  )
); 


// ROUTES MIDDLEWARE
app.use("/api/customer", userRoute);
app.use("/api/vendor", vendorRoute);
app.use("/api/shipper", shipperRoute);


const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}/api/customer/homepage`);
});
