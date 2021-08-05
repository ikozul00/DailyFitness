var express = require('express')
var router = express.Router()
const loginController=require('./controllers/loginController');
const registrationController=require('./controllers/registrationController');
const dayController=require('./controllers/dayController');
const monthController=require('./controllers/monthReportController');
const loadingListsController=require('./controllers/loadingListsController');
const searchController=require('./controllers/searchController');
const exerciseController=require('./controllers/exerciseController');
const planController=require('./controllers/planController');


//login and registration routes
router.post('/login', loginController.checkUser);
router.post('/registration', registrationController.insertUser);

//retriving information about single day
router.post('/dailyReport',dayController.dayInformation);

//updating list of done exercises and sending modified list
router.post('/done/plan',dayController.exerciseDone);
//updating list of eaten meals and sending modified list
router.post('/done/meals',dayController.mealDone);

//deleting exercise plan from a schedule
router.post('/remove/plan',dayController.removeExercisePlan);
//deleting exercise plan from a day plan
router.post('/remove/meals',dayController.removeMealPlan);

router.put('/modify/day',dayController.modifyDayInformation);

router.post('/monthReport',monthController.monthInformation);

//retriving exercises, plans and recipies written by logged user
router.post('/my',loadingListsController.retriveMy);

//retriving all public plans, exercises or recipies from database
router.get('/all',loadingListsController.retriveAll);

//returning results of search request
router.get('/search',searchController.searchByName);

//returning result of search by tags
router.post('/search/tags',searchController.searchByTags);

//getting information about one exercise
router.get('/exercise',exerciseController.getExercise);

//getting information about one plan
router.get('/plan',planController.getPlan);

router.post('/add/plan', planController.addPlanToDB);

module.exports = router;