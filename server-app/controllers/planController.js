var pool=require('../connectingDatabase');
const dayController=require('./dayController');

//processing request from frontend
exports.getPlan = async function(req,res){
    let plan= await retrivePlan(req);
    plan = await retriveExercises(plan.planId,plan);
    res.json({"plan":plan});
}

//getting information about plans, tags related to that plan from database
function retrivePlan(req){
    return new Promise((resolve, reject) => {
        pool.query(`SELECT calories,description,"planId","planTag" FROM plan
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
            plan.tags=[];
            for(let i=0;i<result.rows.length;i++){
                plan.tags.push(result.rows[i].planTag);
            }
            plan.exercise=[];
            resolve(plan);
        });
    });
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
            let exercise={};
            for(let i=0;i<result.rows.length;i++){
                exercise.title=result.rows[i].title;
                exercise.content=result.rows[i].content;
                exercise.calories=result.rows[i].calories;
                exercise.username=result.rows[i].username;
                exercise.length=result.rows[i].length;
                exercise.measure=result.rows[i].measure;
                plan.exercise.push(exercise);
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
            console.log(result.rows);
            if(result.rows.length===0){
                resolve(false);
            }
            else{
                resolve(true);
            }
        });

    });
}