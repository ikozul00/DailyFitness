var pool=require('../connectingDatabase');
const dayController=require('./dayController');
const exerciseController = require('./exerciseController');

//processing request from frontend
exports.getPlan = async function(req,res){
    let plan= await retrivePlan(req);
    plan.favorite = await planFavorite(plan.planId,req.query.user);
    plan = await retriveExercises(plan.planId,plan);
    res.json({"plan":plan});
}

//getting information about plans, tags related to that plan from database
function retrivePlan(req){
    return new Promise((resolve, reject) => {
        pool.query(`SELECT calories,description,"planId","planTag",private FROM plan
        LEFT JOIN "plan_planTags" ON "plan_planTags"."planID"=plan."planId"
        LEFT JOIN "planTags" ON "planTags"."planTagId"="plan_planTags"."planTagID"
        WHERE title='${req.query.title}' AND "userID" =(SELECT "userId" FROM "userTable"
        WHERE username='${req.query.author}')`,(error,result) => {
            if(error){
                reject(new Error("Error getting plan from databse."));
            }
            let plan={};
            plan.calories=result.rows[0].calories;
            plan.description=result.rows[0].description;
            plan.planId=result.rows[0].planId;
            plan.privatePlan=result.rows[0].private;
            plan.tags=[];
            plan.favorite=false;
            for(let i=0;i<result.rows.length;i++){
                plan.tags.push(result.rows[i].planTag);
            }
            resolve(plan);
        });
    });
}

//checking if currently logged user had added plan with planId to favorite plans
function planFavorite(planId,user){
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM "planSaved"
        WHERE "planID" = '${planId}' AND "userID" = (SELECT "userId" FROM "userTable" 
        WHERE username='${user}')`, (error,result) => {
            if(error){
                reject(new Error("Error checking if plan is put in favorites."));
            }
            if(result.rows.length===0){
                resolve(false);
            }
            else{
                resolve(true);
            }
        });
    });
}

//removing plan from favorites or adding it to favorites
exports.togglePlanFavorite = async function togglePlanFavorite(req,res){
    let saved = await planFavorite(req.body.planId, req.body.user);
    if(saved && !req.body.save){
        pool.query(`DELETE FROM "planSaved"
        WHERE "planID"='${req.body.planId}' AND "userID" = (SELECT "userId" FROM "userTable"
        WHERE username='${req.body.user}' )
        RETURNING * `, (error, result) => {
            if(error){
                throw error;
            }
            if(result.rows.length===0){
                res.json({"success":false});
            }
            else{
                res.json({"success":true});
            }
        });
    }

    else if(!saved && req.body.save){
        let userId= await getUserId(req.body.user);
        if(!userId){
            res.json({"success":false});
        }
        else{
            pool.query(`INSERT INTO "planSaved" ("userID", "planID")
            VALUES ('${userId}', '${req.body.planId}')
            RETURNING *`, (error,result) => {
                if(error){
                    throw error;
                }
                if(result.rows.length===0){
                    res.json({"success":false});
                }
                else{
                    res.json({"success":true});
                }
            });
        }
       
    }

    else{
        res.json({"success":false});

    }
}



//getting exercises which are part of plan identified by id from database
function retriveExercises(id,plan){
    return new Promise((resolve,reject) =>{
        pool.query(`SELECT title,content,calories,username,length,measure FROM exercise
        INNER JOIN plan_exercise ON plan_exercise."exerciseID"=exercise."exerciseId"
        INNER JOIN "userTable" ON "userTable"."userId"=exercise."userID"
        WHERE plan_exercise."planID"='${id}'`, (error,result) =>{
            if(error){
                reject(new Error("Error getting plan from databse."));
            }
            plan.exercise=[];
            for(let i=0;i<result.rows.length;i++){
                plan.exercise.push(result.rows[i]);
            }
            resolve(plan);
        });
    });
}

//add infrormation about connection between plan,date and user in database, so it can be displayed in calendar
exports.addPlanToDB = async function (req,res){
    let dateId=await dayController.doesDateExists(req.body.date);
    if(!dateId){
        dateId=await dayController.createDate(req.body.date);
    }

    let userId= await getUserId(req.body.username);
    if(!userId){
        res.json({"status":false,"exists":false});
    }
    else{
        let planId = await getPlanId(req.body.title,req.body.author);
        if(!planId){
            res.json({"status":false,"exists":false});
        }
        else{
            let exists=await dataExistsDB(userId,planId,dateId);
            if(exists){
                res.json({"status":false,"exists":true});
            }
            else{
                pool.query(`INSERT INTO date_user_plan ("userID","planID","dateID",timestamp,done)
                VALUES ('${userId}', '${planId}', '${dateId}', '${new Date().toDateString()}', false)
                RETURNING *`, (error,result) => {
                    if(error){
                        throw error;
                    }
                    if(result.rows.length===0){
                        res.json({"status":false,"exists":false});
                    }
                    else{
                        res.json({"status":true,"exists":false});
                    }
            });
        }
        }
    }
}

//retriving userId from database, returns false if user with that username doesn't exist
function getUserId(username){
    return new Promise((resolve,reject) =>{
        pool.query(`SELECT "userId" FROM "userTable" WHERE username='${username}' `,(error,result) => {
            if(error){
                reject(new Error("trouble getting userId from database"));
            }
            if(result.rows.length===0){
                resolve(false);
            }
            else{
                resolve(result.rows[0].userId);
            }
        });

    });
}

//retriving planId from database, returns false if plan with that title and author doesn't exist
function getPlanId(title,author){
    return new Promise((resolve,reject) =>{
        pool.query(`SELECT "planId" FROM plan 
        WHERE title='${title}' AND "userID"=(SELECT "userId" FROM "userTable"
        WHERE username='${author}' )`,(error,result) => {
            if(error){
                reject(new Error("trouble getting planId from database"));
            }
            if(result.rows.length===0){
                resolve(false);
            }
            else{
                resolve(result.rows[0].planId);
            }
        });

    });
}

//check if row that connects date,user and plan already exsists
function dataExistsDB(userId,planId,dateId){
    return new Promise((resolve,reject) =>{
        pool.query(`SELECT * FROM date_user_plan 
        WHERE "planID"='${planId}' AND "userID"='${userId}' AND "dateID"='${dateId}' `,(error,result) => {
            if(error){
                reject(new Error("Problem checking if data exists in database"));
            }
            if(result.rows.length===0){
                resolve(false);
            }
            else{
                resolve(true);
            }
        });

    });
}

//retriving exerciseId from database, returns false if exercise with that title and author doesn't exist
function getExerciseId(title,author){
    return new Promise((resolve,reject) => {
        pool.query(`SELECT "exerciseId" FROM exercise
        WHERE title='${title}' AND "userID" = (SELECT "userId" FROM "userTable"
        WHERE username='${author}') `,(error,result) => {
            if(error){
                reject(new Error("Error retriving exerciseId from database."));
            }
            if(result.rows.length===0){
                resolve(false);
            }
            else{
                resolve(result.rows[0].exerciseId);
            }
        });
    });
}

exports.AddExerciseToPlan = async function (req,res){
    let exerciseId= await getExerciseId(req.body.exTitle,req.body.exAuthor);
    let planId = await getPlanId(req.body.title,req.body.author);
    if(exerciseId && planId){
        let exists=await ExercisePlanExists(exerciseId,planId);
        if(exists){
            res.json({"success":false,"exists":true});
        }
        else{
            let error= await ConnectPlanExercise(planId, exerciseId, req.body.length, req.body.measure);
            if(error){
                res.json({"success":true,"exists":false});
            }
            else{
                res.json({"success":false,"exists":false});
            }
        }
    }
    else{
        res.json({"success":false,"exists":false});
    }
}

function ExercisePlanExists(exerciseId,planId){
    return new Promise((resolve,reject) => {
        pool.query(`SELECT * FROM plan_exercise
        WHERE "exerciseID"='${exerciseId}' AND "planID" ='${planId}' `,(error,result) => {
            if(error){
                reject(new Error("Error checking if data already exists in plan_exercise table."));
            }
            if(result.rows.length===0){
                resolve(false);
            }
            else{
                resolve(true);
            }
        });
    });
}


exports.NewPlan= async function NewPlan(req,res){
   let exists= await getPlanId(req.body.title,req.body.author);
   if(exists){
       res.json({"success":false, "exists":true});
   }
   else{
       let userId=await getUserId(req.body.author);
       if(!userId){
        res.json({"success":false, "exists":false});
       }
       else{
           let planId= await createPlan(req,userId);
           if(!planId){
            res.json({"success":false, "exists":false});
           }
           else{
               let error=false;
               let exerciseInfo=[];
               for(let i=0;i<req.body.exercises.length;i++){
                let exerciseId= await getExerciseId(req.body.exercises[i].title,req.body.exercises[i].author);
                if(!exerciseId){
                    error=true;
                    break;
                }
                if(!(await ConnectPlanExercise(planId,exerciseId,req.body.exercises[i].lengthEx,req.body.exercises[i].measure))){
                    error=true;
                    break;
                }
               }
               if(error){
                res.json({"success":false, "exists":false});
               }
               else{
                   let error=false;
                   for(let i=0;i<req.body.tags.length;i++){
                        let tagId= await exerciseController.getTagId(req.body.tags[i]);
                        if(!tagId){
                            error=true;
                            break;
                        }
                        if(!(await ConnectPlanTag(planId,tagId))){
                            error=true;
                            break;
                        }
                   }
                   if(error){
                    res.json({"success":false, "exists":false});
                   }
                   else{
                    res.json({"success":true, "exists":false});
                   }
               }
           }
       }
   }
}

function createPlan(req, userId){
    return new Promise((resolve,reject) => {
        pool.query(`INSERT INTO plan (title,description, calories, "userID", private)
        VALUES ('${req.body.title}', '${req.body.description}', '${req.body.cal}', '${userId}', '${req.body.private}')
        RETURNING * `, (error,result) => {
            if(error){
                reject(new Error("Error creating new plan in plan table."));
            }
            if(result.rows.length===0){
                resolve(false);
            }
            else{
                resolve(result.rows[0].planId);
            }
        });
    });
}


function ConnectPlanExercise(planId,exerciseId,lenghtEx,measure){
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO plan_exercise ("planID", "exerciseID", length, measure)
        VALUES ('${planId}', '${exerciseId}', '${lenghtEx}', '${measure}')
        RETURNING * `,(error,result) => {
            if(error){
                reject(new Error("Error connecting plan and exercise by inserting new row in plan_exercise table."));
            }
            if(result.rows.length===0){
                resolve(false);
            }
            else{
                resolve(true);
            }
        });
    });
}

function ConnectPlanTag (planId,tagId){
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO "plan_planTags" ("planID", "planTagID")
        VALUES ('${planId}', '${tagId}')
        RETURNING * `, (error,result) => {
            if(error){
                reject(new Error("Error connecting plan and tag."));
            }
            if(result.rows.length===0){
                resolve(false);
            }
            else{
                resolve(true);
            }
        });
    });
}

//function for deleting plan from database based on plan title and author
exports.deletePlan = async function deletePlan(req,res){
    //retriving planId from database
    let planId= await getPlanId(req.query.name,req.query.author);
    if(!planId){
        res.json({"success":false});
    }
    else{
        let success=false;
        //deleting connections between this plan and tags
        success= await deletePlanTagConnection(planId);
        if(!success){
            res.json({"success":false});
        }
        else{
            //deleting connections between this plan and exercises that was added to it
            success= await deletePlanExerciseConnection(planId);
            if(!success){
                res.json({"success":false});
            }
            else{
                //deleting connections between this plan and dates it has been added to
                success= await deletePlanDateConnection(planId);
                if(!success){
                    res.json({"success":false});
                }
                else{
                    //deleting row from plan table that has corresponding value for planId
                    pool.query(`DELETE FROM plan
                    WHERE "planId" = '${planId}' 
                    RETURNING *`, (error, result) => {
                        if(error){
                            throw error;
                        }
                        if(result.rows.length===0){
                            res.json({"success":false});
                        }
                        else{
                            res.json({"success":true});
                        }
                    });
                }
            }
        }

    }
   
}


function deletePlanTagConnection(planId){
    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM "plan_planTags"
        WHERE "planID"='${planId}' `, (error,result) => {
            if(error){
                reject(new Error("Error deleting connection between plan and tag."));
            }
            resolve(true);
        });
    });  
}

function deletePlanExerciseConnection(planId){
    return new Promise((resolve,reject) => {
        pool.query(`DELETE FROM plan_exercise
        WHERE "planID"='${planId}' `, (error,result) => {
            if(error){
                reject(new Error("Error deleting connection between plan and exercise."));
            }
            resolve(true);
        });
    });
}


function deletePlanDateConnection(planId){
    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM date_user_plan
        WHERE "planID"='${planId}' `, (error,result) => {
            if(error){
                reject(new Error("Error deleting connection between plan and date."));
            }
            resolve(true);
        });
    });  
}

exports.getUserId=getUserId;