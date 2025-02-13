const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token; // Read the token from the cookie

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // Attach the user ID to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(400).send('Invalid token.');
    }
};

module.exports = authMiddleware;
