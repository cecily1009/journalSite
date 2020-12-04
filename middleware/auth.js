require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  //Get token from header
  const token = req.header('x-auth-token');

  //check if not token
  if (!token) {
    //401 status : No authorization, permission denied.
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  //Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
