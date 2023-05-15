const path = require('path');
const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require("cookie-parser");
const errorHandler = require('./middlewares/error');
const cors = require('cors');
const flash = require('connect-flash');
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
// app.use(bodyParser.json());
app.use(cookieParser());
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(cors());
// Set security headers
// app.use(helmet());
// app.use(fileUpload());
// app.use(authMiddleware.verifyToken);
// app.use(flash());
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


// ERROR MIDDLEWARE
app.use(errorHandler);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
})




//frontend
const vendorRoute = require("./routes/vendor");
const userRoute = require("./routes/customer");
const shipperRoute = require("./routes/shipper");
app.use("/vendor", vendorRoute);
app.use("/customer",userRoute);
app.use('/shipper', shipperRoute);
