const jwt = require("jsonwebtoken");

// Middleware to authenticate requests using JWT
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.replace('Bearer ', ''); //get token from header
    // Check if no token
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

  
    //decode token
    try {
      // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //attach user to request object
        req.user = decoded.user;
        //pass to the next middleware or route handler
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

// Export the authMiddleware
module.exports = authMiddleware;