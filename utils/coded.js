const jwt = require('jsonwebtoken');

const coded = (payload, time) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: time });
}

module.exports = coded;
