const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

// const { JWT_SECRET } = process.env;

const jwtSign = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1d',
  });
};


const jwtVerify = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return false;
  }
};

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json({message: "Authentication failed"})
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) return res.status(401).json({message: "Authentication Failed"})
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({message: "Authentication failed: 🔒🔒🔒🔒🔒"})
  }
};


module.exports = { jwtSign, jwtVerify, isAuthenticated };