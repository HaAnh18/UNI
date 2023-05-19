// const ErrorResponse = require("../utils/errorResponse");

// const errorHandler = (err, req, res, next) => {

//   console.log(err);

//   let error = {...err};

//   error.message = err.message;

//   // MONGOOSE BAD OBJECT ID
//   if (err.name === "CastError") {
//     const message = "Ressource not found";
//     error = new ErrorResponse(message, 404);
//   };

//   // DUPLICATE VALUE
//   if (err.code === 11000) {
//     const message = "Duplicate field value entered";
//     error = new ErrorResponse(message, 400);
//   }

//   if (err.name === "ValidationError") {
//     const message = Object.values(err.errors).map(value => value.message);
//     error = new ErrorResponse(message, 400);
//   }

//   res.status(err.statusCode || 500).json({
//     success: false,
//     error: error.message || `Server Error`
//   })
// };

// module.exports = errorHandler;