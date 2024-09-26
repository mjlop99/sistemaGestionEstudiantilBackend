const express = require('express');
const { authController, decoded } = require('../authRoutes')
const coded = require('../../utils/coded')
const sendEmail = require('../../utils/email')
const { generatePasswordBcrypt, verifyPassword } = require('../../utils/passord')
const User = require('../../models/User')
const router = express.Router();
const { register, login } = require('../../controllers/authController');

router.post('/register', register);
router.post('/login', login);

router.get('/register/:token', async (req, res) => {
    const token = req.params.token;
    console.log(token);
    let user
    try {
        user = decoded(token)
        const newUser = new User(user)
        await newUser.save()
    } catch (err) {
        return res.status(401).send({ msg: 'Invalid token' });
    }

    console.log(user);
    res.status(200).send({ msg: 'Token is valid', user });
});

router.put('/register/change-password/', async (req, res) => {
    let mail = req.body.mail;
    const newPassword = req.body.newPassword
    let user
    try {
        user = await User.findOne({ mail: mail });
        if (!user) {
            return res.status(404).send({ msg: 'Usuario no encontrado' })
        }
        
        mail = user.mail
        const password = await generatePasswordBcrypt(newPassword)
        const username = user.username
        const token = await coded({ user: { mail, username, password } }, '5m')

        //envio de correo

        sendEmail(user.mail, 'cambio de contraseña', 'has click en el siguiente enlace para cambiar tu contrasena', `<h1>Tu enlace sera valido solo por 5m</h1>
            <a href="${process.env.URL}api/auth/register/change-password/${token}">click para cambiar</a>`)

        res.status(200).send({ msg: "para realizar los cambio verifique en email" })

    } catch (err) {
        console.log(err);
        return res.status(401).send({ msg: err });
    }
});

router.get('/register/change-password/:token', async (req, res) => {
    const token = req.params.token

    try {

        const decodedToken = await decoded(token)
        const user = await User.findOne({ mail: decodedToken.mail })
        if (!user) {
            res.status(401).send({msg:"no se ha encontado"})
        }
        user.password = decodedToken.password
        user.save()
        res.status(200).send({ msg: "contrasena cambiada" })
    } catch (error) {
        res.status(500).send({msg:error})
    }

})




module.exports = router;
