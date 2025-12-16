// This middleware handles errors throughout the application
const errorHandler = (err, req, res, next) => {
    // Get the status code from response or default to 500 (server error)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Set the status code
    res.status(statusCode);

    // Send error response
    res.json({
        message: err.message,
        // Only show error stack in development mode
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = errorHandler;
