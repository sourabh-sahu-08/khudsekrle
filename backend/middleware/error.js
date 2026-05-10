exports.errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(err);

  if (err.name === "CastError") {
    error = { message: "Resource not found.", statusCode: 404 };
  }

  if (err.code === 11000) {
    error = { message: "A record with that value already exists.", statusCode: 400 };
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((value) => value.message)
      .join(", ");

    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server error.",
  });
};
