const bcrypt = require('bcryptjs');

const generatePasswordBcrypt = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

const verifyPassword = async (plainPassword, hash) => {
    const result = await bcrypt.compare(plainPassword, hash);
    return result;
  };


  module.exports={generatePasswordBcrypt,verifyPassword}
