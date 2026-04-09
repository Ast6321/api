const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  try {

    let token;

   
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

   
    else if (req.headers.authorization) {
      const authHeader = req.headers.authorization;

      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

   
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};


