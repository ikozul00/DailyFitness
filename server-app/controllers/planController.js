var pool=require('../connectingDatabase');

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