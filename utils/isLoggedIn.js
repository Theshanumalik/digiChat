const jwt = require("jsonwebtoken");
const JWT_SECRET = "9q8rhv7788vadfkqhoe7r-19038";
const isLoggedIn = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    req.user = null;
    next();
    return;
  }
  const isVerrified = jwt.verify(token, JWT_SECRET);
  if (isVerrified) {
    req.user = isVerrified;
    next();
    return;
  }
};

const getGroupId = (token) => {
  const isVerrified = jwt.verify(token, JWT_SECRET);
  if (isVerrified) {
    return isVerrified;
  }
};

module.exports = { isLoggedIn, getGroupId };
