var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser');
var pool=require('./connectingDatabase');
const { response } = require('express');
const loginController=require('./controllers/loginController');
const registrationController=require('./controllers/registrationController');
const dayController=require('./controllers/dayController');


//login and registration routes
router.post('/login', loginController.checkUser);
router.post('/registration', registrationController.insertUser);

//retriving information about single day
router.post('/dailyReport',dayController.dayInformation);

//updating list of done exercises and sending modified list
router.post('/done/exercises',dayController.exerciseDone);
//updating list of eaten meals and sending modified list
router.post('/done/meals',dayController.mealDone);

//deleting exercise plan from a schedule
router.post('/remove/exercises',dayController.removeExercisePlan);
//deleting exercise plan from a day plan
router.post('/remove/meals',dayController.removeMealPlan);

  module.exports = router