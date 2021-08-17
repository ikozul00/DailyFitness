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
const pictureController=require('./controllers/pictureController');
const userController = require('./controllers/userController');


//login and registration routes
router.post('/login', loginController.checkUser);
router.post('/registration', registrationController.insertUser);

//retriving information about single day
router.post('/dailyReport',dayController.dayInformation);

//updating list of done exercises and sending modified list
router.post('/done/plan',dayController.planDone);
//updating list of eaten meals and sending modified list
router.post('/done/exercise',dayController.exerciseDone);

//deleting plan from a schedule
router.post('/remove/plan',dayController.deletePlan);
//deleting exercise from a schedule
router.post('/remove/exercise',dayController.deleteExercise);

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
router.get('/exercise',exerciseController.getExerciseInfo);

//getting information about one plan
router.get('/plan',planController.getPlan);

//adding to database information about connection between user, date and plan (user added plan to calendar)
router.post('/add/plan', planController.addPlanToDB);

//adding to database information about connection between user, date and exercise (user added exercise to calendar)
router.post('/add/exercise', exerciseController.addExerciseToDB);

//creating new exercise in database
router.post('/create/exercise',exerciseController.createExercise);

//adding exercises to a plan
router.post('/modify/plan',planController.AddExerciseToPlan);

//creating new plan in database
router.post('/create/plan',planController.NewPlan);

router.post("/picture",pictureController.getPicture);

//getting information about user from DB so we can display it in user profile
router.get("/user",userController.getUserData);

//deleting plan and all data it is connected to from database
router.delete("/delete/plan",planController.deletePlan);

//deleting exercise and all data it is connected to from database
router.delete("/delete/exercise",exerciseController.deleteExercise);

//adding plan to favorites or removing it
router.post("/modify/planSave",planController.togglePlanFavorite);

//adding exercise to favorites or removing it
router.post("/modify/exerciseSave",exerciseController.toggleExerciseFavorite);

router.post("/favorites/exercises", loadingListsController.loadFavoriteExercises);

router.post("/favorites/plans", loadingListsController.loadFavoritePlans);


module.exports = router;