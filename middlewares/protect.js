const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  // browser (cookie)
  if (req.cookies?.token) {
    token = req.cookies.token;
  }

  // API (Bearer token)
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { protect };
