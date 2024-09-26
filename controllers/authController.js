const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const coded = require('../utils/coded')
const sendEmail = require('../utils/email'); // Import the email utility

exports.register = async (req, res) => {
  const { username, password, mail } = req.body;
  const hashedPassword = await generatePasswordBcrypt(password)

  try {
    //verificamos que no exista
    let user = await User.findOne({ mail });
    if (user) {
      return res.status(400).json({ msg: 'Usuario ya existe' });
    }
    //lo creamos
    user = new User({ mail, username, password: hashedPassword });
    //info para el token
    const payload = { user: { mail, username, password: hashedPassword } };
    //firma del token

    const token = coded(payload, '1H');
    if (token) {
      // Send a welcome email
      const subject = 'BIENVENIDO';
      const text = 'Gracias ser parte de nosotros, para completar tu rgistro haz en el siguiente enlace!';
      const html = `<h1>${text}!</h1> <a href="${process.env.URL}api/auth/register/${token}">Click para registro</a>`;
      await sendEmail(user.mail, subject, text, html);
      return res.status(202).send({msg:'para completar tu registro aceptar email'})
    }


  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { mail, password } = req.body;
  try {
    //verificamos que el usuario existe
    let user = await User.findOne({ mail });
    if (!user) {
      return res.status(400).json({ msg: 'credenciales invalidas' });
    }
    //comparamos contrasena

    const isMatch = await this.verifyPassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'credenciales invalidas' });
    }

    //cargamos al token
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const generatePasswordBcrypt = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

exports.verifyPassword = async (plainPassword, hash) => {
  const result = await bcrypt.compare(plainPassword, hash);
  return result;
};
