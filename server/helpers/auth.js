const jwt = require('jsonwebtoken');
const secKey = 'fnsiiw4958nfslno34';

function authMiddleware (req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    // res.status(401).json({ message: 'Unauthorized'});
    res.redirect('/')
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized'});
  }
}

function isLoggedIn (req, res, next) {
  
  let data;
  if (req.cookies.token) {
    const { token } = req.cookies;
    jwt.verify(token, secKey, {}, (err, info) => {
      if (err) throw err
      // res.json(info)
      data = info;
    })
  } else {
    data = false;
  }
  return data
}

module.exports = { authMiddleware, isLoggedIn }