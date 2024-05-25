const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req, res, next) {
  const token = req.header("jwtToken");
  const refreshToken = req.header("refreshToken");

  if (!token) {
    return res.status(403).json({ msg: "Authorization denied" });
  }

  try {
    const verify = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verify.user;
    next();
  } catch (err) {
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token is not valid" });
    }

    try {
      const verifyRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const newAccessToken = jwt.sign({ user: verifyRefresh.user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
      res.setHeader('newAccessToken', newAccessToken);
      req.user = verifyRefresh.user;
      next();
    } catch (err) {
      return res.status(401).json({ msg: "Refresh token is not valid" });
    }
  }
};
