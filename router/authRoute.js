const express = require('express');
const authRouter = express.Router();
const {signup, signin, getuser} = require('../controller/authController.js');
const jwtAuth = require("../middleware/jwtAuth.js");

authRouter.post('/signup', signup);
authRouter.post('/signin', signin);
authRouter.get("/user",jwtAuth, getuser); // next() in jwt Auth will help to move forward to getUser else it will stuck in jwtAuth

module.exports = authRouter;