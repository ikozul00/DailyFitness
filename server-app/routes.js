var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser');
var pool=require('./connectingDatabase');
const { response } = require('express');
const loginController=require('./controllers/loginController');
const registrationController=require('./controllers/registrationController');
const dayController=require('./controllers/dayController');
const monthController=require('./controllers/monthReportController');
const plansController=require('./controllers/planController');
const exercisesController=require('./controllers/loadingListsController');
const loadingListsController=require('./controllers/loadingListsController');


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

router.put('/modify/day',dayController.modifyDayInformation);

router.post('/monthReport',monthController.monthInformation);

//retriving plans written by logged user
router.post('/myPlans',plansController.retriveMyPlans);

//retriving all public plans from database
router.get('/plans',plansController.retrivePlans);

//retriving exercises written by logged user
//router.post('/myExercises',exercisesController.retriveMyExercises);

router.post('/my',loadingListsController.retriveMy);

router.get('/all',loadingListsController.retriveAll);

module.exports = router;