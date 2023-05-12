const express = require("express"); // Import Express Framework
const app = express(); // Store express in app
const path = require("path");
const port = 10000;

// Middleware execution for static files
module.exports = path.dirname(require.main.filename);
app.use(express.static(path.join(__dirname, "public"))); // Serve static files
// Call bootstrap css file with class path
app.use(
  "/css",
  express.static(
    path.join(__dirname, "node_modules", "bootstrap", "dist", "css")
  )
);
// Intergrated EJS Template
app.set("view engine", "ejs");
app.set("views", "./views"); // setting config option for views folder


const vendorRoute = require("./routes/vendor");
const userRoute = require("./routes/customer");
app.use("/vendor", vendorRoute);
app.use("/customer",userRoute);


// Starting
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
