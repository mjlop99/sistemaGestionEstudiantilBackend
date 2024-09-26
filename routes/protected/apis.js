const express = require('express');
const User=require('../../models/User')
const {authController}=require('../authRoutes')
const router = express.Router();

router.get('/protected',authController,(req, res)=>{
    return res.status(200).send({msg:"ok"})
});

module.exports = router;