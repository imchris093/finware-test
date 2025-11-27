// backend/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const auth = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, secret);
      req.user = decoded; 
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Token no válido o expirado.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Acceso denegado, no se proporcionó token.' });
  }
};

module.exports = auth;