const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    res.status(401).json({ message: 'Not authenticated'});
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'scerettoken');
  } catch (err) {
    res.status(500).json({ message: 'Invalid token'});
  }
  if (!decodedToken) {
    res.status(401).json({ message: 'Not authenticated'});
  }
  req.userId = decodedToken.userId;
  next();
};
