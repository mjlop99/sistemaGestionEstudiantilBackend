const jwt = require('jsonwebtoken');

const authController = (req, res, next) => {
  const token = req.header('token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorizacion denegada' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token no valido' });
  }
};


const decoded = (token)=> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.user;
  } catch(err) {
    return "token no valido"
  }
}

module.exports = { authController, decoded }