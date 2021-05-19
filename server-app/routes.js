var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser');
var pool=require('./connectingDatabase');
const { response } = require('express');
const loginController=require('./controllers/loginController');
const registrationController=require('./controllers/registrationController');


//checking if user exists in database
router.post('/login', loginController.checkUser);
router.post('/registration', registrationController.insertUser);
 

  module.exports = router