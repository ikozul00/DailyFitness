const { response } = require('express');
var pool=require('../connectingDatabase');


//loading information about one day
exports.dayInformation=async function(req,res){
    var information={
        exercises:[],
        plans:[],
        plannedCalSpentEx:0,
        plannedCalSpentPlan:0,
        calSpentExercise:0,
        calSpentPlans:0,
        calEaten:0,
        calSpentOutOfPlan:0,
        weight:0,
        motivation:0,
        notes:0,
    }
    information = await loadPlans(req, information);
    information = await loadExercises(req, information);
    information = await loadAdditionalInfoDay(req.body.name, req.body.date, information);
    if(!information.weight || information.weight===0){
        information.weight = await getUsersWeight(req.body.name);
    }
    res.json({"information": information});
}

//loading list of plans added to date req.body.date
function loadPlans(req, info){
    return new Promise((resolve,reject) => {
        pool.query(`SELECT plan.title,date_user_plan.done,plan.calories,"userTable".username FROM plan
        INNER JOIN date_user_plan ON plan."planId"=date_user_plan."planID"
        INNER JOIN dates ON date_user_plan."dateID"=dates."dateId"
        INNER JOIN "userTable" ON plan."userID"="userTable"."userId"
        WHERE date_user_plan."userID"=(SELECT "userId" FROM "userTable" WHERE username='${req.body.name}') AND dates.date='${req.body.date}' 
        ORDER BY plan.title`, (error,result)=>{
            if(error){
                reject(new Error("Error while loading plans form db."));
            }
            for(let i=0;i<result.rows.length;i++){   
                let data=[result.rows[i].title,result.rows[i].username,result.rows[i].calories,result.rows[i].done];
                //if plan is done add calories to calories spent
                if(result.rows[i].done){
                    info.calSpentPlans+=result.rows[i].calories;
                }
                info.plannedCalSpentPlan+=result.rows[i].calories;
                info.plans.push(data);
            } 
            resolve(info);
        });       
    });
}

//loading list of exercises added to date req.body.date
function loadExercises(req, info){
    return new Promise((resolve,reject) => {
        pool.query(`SELECT exercise.title,date_user_exercise.done,exercise.calories,"userTable".username FROM exercise
        INNER JOIN date_user_exercise ON exercise."exerciseId"=date_user_exercise."exerciseID"
        INNER JOIN dates ON date_user_exercise."dateID"=dates."dateId"
        INNER JOIN "userTable" ON exercise."userID"="userTable"."userId"
        WHERE date_user_exercise."userID"=(SELECT "userId" FROM "userTable" WHERE username='${req.body.name}') AND dates.date='${req.body.date}' 
        ORDER BY exercise.title`, (error,result)=>{
            if(error){
                reject(new Error("Error while loading exercises from db."));
            }
            for(let i=0;i<result.rows.length;i++){   
                let data=[result.rows[i].title,result.rows[i].username,result.rows[i].calories,result.rows[i].done];
                //if exercise is done add calories to calories spent
                if(result.rows[i].done){
                    info.calSpentExercise+=result.rows[i].calories;
                }
                info.plannedCalSpentEx+=result.rows[i].calories;
                info.exercises.push(data);
            } 
            resolve(info);
        });       
    });
}

//loading calories eaten, additional calories spent, weight, motivation level and notes user entered for that date
function loadAdditionalInfoDay(name, date, info){
    return new Promise((resolve, reject) => {
        pool.query(`SELECT "calorieIntake", "calorieSpent", weight, "motivationLevel",notes FROM user_dates
             WHERE "userID"=(SELECT "userId" FROM "userTable" WHERE username='${name}')
             AND "dateID"=(SELECT "dateId" FROM dates WHERE date='${date}' )`,(error,result)=>{
                 if(error){
                    reject(new Error("Error while additional info about day from db."));
                 }
                 if(result.rows.length===0){
                     info.weight=false;
                     resolve(info);
                 }
                 else{
                    info.calEaten = result.rows[0].calorieIntake;
                    info.calSpentOutOfPlan = result.rows[0].calorieSpent;
                    info.motivation=result.rows[0].motivationLevel;
                    info.notes=result.rows[0].notes;
                   info.weight=result.rows[0].weight; 
                   resolve(info);
                 }
        });

    });
}

//loading weight user entered at registration
function getUsersWeight(name){
    return new Promise((resolve, reject) => {
        pool.query(`SELECT weight FROM "userTable" WHERE username='${name}' `,(error,result)=>{
            if(error){
                reject(new Error("Error while getting users weight from db."));
            }
            else{
                if(result.rows.length===0){
                    reject(new Error("Error while getting users weight from db."));
                }
                else{
                    resolve(result.rows[0].weight);
                }
            }
        });

    });
}


//updating information about plan status
exports.planDone = async function(req,res){
    let success = await updatePlanDone(req);
    if(!success){
        res.json({"message":"Update unsuccessful","success":false});
    }
    else{
        let information = await planInformation(req);
        res.json({"success":true,"information":information});
    }
}


function updatePlanDone(req){
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE date_user_plan SET done='${req.body.done}'
        WHERE "userID"=(SELECT "userId" FROM "userTable" WHERE username='${req.body.username}') 
        AND "planID"=(SELECT "planId" FROM plan WHERE title='${req.body.title}' AND "userID"=(SELECT "userId" FROM "userTable" WHERE username='${req.body.author}'))
        AND "dateID"=(SELECT "dateId" FROM dates WHERE date='${req.body.date}' ) 
        RETURNING *`,(error,result)=>{
            if(error){
                reject(new Error("Error updating plan done in db."));
            }
            if(result.rows.length!==0){
               resolve(true);
            }
            else{
                resolve(false);
            }
        });
    });
}


//retriving new plans list after update
function planInformation(req){
    return new Promise((resolve, reject) => {
        var information={
            plans:[],
            plannedCalSpent:0,
            calSpent:0,
        }
        pool.query(`SELECT plan.title,date_user_plan.done,plan.calories,"userTable".username FROM plan
        INNER JOIN date_user_plan ON plan."planId"=date_user_plan."planID"
        INNER JOIN dates ON date_user_plan."dateID"=dates."dateId"
        INNER JOIN "userTable" ON plan."userID"="userTable"."userId"
        WHERE date_user_plan."userID"=(SELECT "userId" FROM "userTable" WHERE username='${req.body.username}') AND dates.date='${req.body.date}' 
        ORDER BY plan.title`, (error,result)=>{
            if(error){
                reject(new Error("Error getting list of updated plans from db."));
            }
            for(let i=0;i<result.rows.length;i++){
                let data=[result.rows[i].title,result.rows[i].username,result.rows[i].calories,result.rows[i].done,];
                if(result.rows[i].done){
                    information.calSpent+=result.rows[i].calories;
                }
                information.plannedCalSpent+=result.rows[i].calories;
                information.plans.push(data);
            }
            resolve(information);
        });
    });
}

//updating information about exercise status
exports.exerciseDone = async function(req, res){
    let success = await updateExerciseDone(req);
    if(!success){
        res.json({"message":"Update unsuccessful","success":false});
    }
    else{
        let information = await exerciseInformation(req);
        res.json({"success":true,"information":information});
    }
}


function updateExerciseDone(req){
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE date_user_exercise SET done='${req.body.done}'
        WHERE "userID"=(SELECT "userId" FROM "userTable" WHERE username='${req.body.username}') 
        AND "exerciseID"=(SELECT "exerciseId" FROM exercise WHERE title='${req.body.title}' AND "userID"=(SELECT "userId" FROM "userTable" WHERE username='${req.body.author}'))
        AND "dateID"=(SELECT "dateId" FROM dates WHERE date='${req.body.date}' ) 
        RETURNING *`,(error,result)=>{
            if(error){
                reject(new Error("Error updating exercise done in db."));
            }
            if(result.rows.length!==0){
               resolve(true);
            }
            else{
                resolve(false);
            }
        });
    });
}

//retriving new exercises list after update
function exerciseInformation(req){
    return new Promise((resolve, reject) => {
        var information={
            exercises:[],
            plannedCalSpent:0,
            calSpent:0,
        }
        pool.query(`SELECT exercise.title,date_user_exercise.done,exercise.calories,"userTable".username FROM exercise
        INNER JOIN date_user_exercise ON exercise."exerciseId"=date_user_exercise."exerciseID"
        INNER JOIN dates ON date_user_exercise."dateID"=dates."dateId"
        INNER JOIN "userTable" ON exercise."userID"="userTable"."userId"
        WHERE date_user_exercise."userID"=(SELECT "userId" FROM "userTable" WHERE username='${req.body.username}') AND dates.date='${req.body.date}' 
        ORDER BY exercise.title`, (error,result)=>{
            if(error){
                reject(new Error("Error while loading exercises from db."));
            }
            for(let i=0;i<result.rows.length;i++){   
                let data=[result.rows[i].title,result.rows[i].username,result.rows[i].calories,result.rows[i].done];
                //if exercise is done add calories to calories spent
                if(result.rows[i].done){
                    information.calSpent+=result.rows[i].calories;
                }
                information.plannedCalSpent+=result.rows[i].calories;
                information.exercises.push(data);
            } 
            resolve(information);
        });       
    });
}

//deleting plan from a schedule
exports.deletePlan=async function(req,res){
    let success = await deletingPlanFromDB(req);
    if(!success){
        res.json({"message":"Update unsuccessful","success":false});
    }
    else{
        let information = await planInformation(req);
        res.json({"success":true,"information":information});
    }
}

function deletingPlanFromDB(req){
    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM date_user_plan WHERE "dateID"=(SELECT "dateId" FROM dates WHERE date='${req.body.date}')
        AND "planID"=(SELECT "planId" FROM plan WHERE title='${req.body.title}' AND "userID"=(SELECT "userId" FROM "userTable" WHERE username='${req.body.author}'))
        AND "userID"=(SELECT "userId" FROM "userTable" WHERE username='${req.body.username}' ) 
        RETURNING *`, (error,result)=>{
            if(error){
                reject(new Error("Error while deleting plan from db."));
            }
            if(result.rows.length!==0){
                resolve(true);
            }
            else{
                resolve(false);
            }
        });
    });
}

//deleting exercise from a schedule
exports.deleteExercise=async function(req,res){
    let success = await deletingExerciseFromDB(req);
    if(!success){
        res.json({"message":"Update unsuccessful","success":false});
    }
    else{
        let information = await exerciseInformation(req);
        res.json({"success":true,"information":information});
    }
}

function deletingExerciseFromDB(req){
    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM date_user_exercise WHERE "dateID"=(SELECT "dateId" FROM dates WHERE date='${req.body.date}')
        AND "exerciseID"=(SELECT "exerciseId" FROM exercise WHERE title='${req.body.title}' AND "userID"=(SELECT "userId" FROM "userTable" WHERE username='${req.body.author}'))
        AND "userID"=(SELECT "userId" FROM "userTable" WHERE username='${req.body.username}' ) 
        RETURNING *`, (error,result)=>{
            if(error){
                reject(new Error("Error while deleting exercise from db."));
            }
            if(result.rows.length!==0){
                resolve(true);
            }
            else{
                resolve(false);
            }
        });
    });
}


//updating databse with information user has entered about one date
exports.modifyDayInformation = async function(req,res){
    let d= await doesDateExists(req.body.date);
    //if date doesn't exist in database, creating it first then insertig information about day in database
    if(!d){
        try{
            //creating date in database
            d=await createDate(req.body.date);
            ///creating information about the day
            let created= await creatingDayInformation(req,res,d);
            if(created){
                res.statusCode=200;
                res.json({"message":"successful"});
            }
            else{
                res.statusCode=404;
                res.json({"message":"trouble creating day information"});
            }
        }
        catch(err){
            console.log(err);
            res.statusCode=404;
            res.json({"message":err});
        }
    }
    else{   
        try{
        let existsDay=await doesDayInformationExists(d,req.body.name);
        //does information about day already exists in database, if yes update
        if(existsDay){
            pool.query(`UPDATE user_dates 
            SET "calorieIntake"='${req.body.calEaten}', "calorieSpent"='${req.body.calSpent}', weight='${req.body.weight}', "motivationLevel"='${req.body.motivation}', notes='${req.body.notes}'
            WHERE "userID"=(SELECT "userId" FROM "userTable" WHERE username='${req.body.name}')
            AND "dateID"=(SELECT "dateId" FROM dates WHERE date='${req.body.date}') `,(error,result)=>{
                if(error){
                    throw error;
                }
                if(result.rowCount===1){
                    res.statusCode=200;
                    res.json({"message":"Success"});
                    res.end();
                }
                else{
                    res.statusCode=404;
                    res.json({"message":"Trouble updating database"});
                    res.end();
                }
            });
        }
        //does information about day already exists in database, if not insert it
        else{
            let created= await creatingDayInformation(req,res,d);
            if(created){
                res.statusCode=200;
                res.json({"message":"successful"});
            }
            else{
                res.statusCode=404;
                res.json({"message":"trouble creating day information"});
            }
        }
    }
        catch(err){
            console.log(err);
            res.statusCode=404;
            res.json({"message":err});
        }
    }
}

//inserting information about the day in database
function creatingDayInformation(req,res,date){
    return new Promise((resolve,reject)=>{
        pool.query(`INSERT INTO user_dates ("userID","dateID","calorieIntake","calorieSpent",weight,"motivationLevel",notes)
        SELECT "userId", '${date}', '${req.body.calEaten}', '${req.body.calSpent}', '${req.body.weight}', '${req.body.motivation}', '${req.body.notes}'
        FROM "userTable" WHERE username='${req.body.name}' `,(err,res)=>{
            if(err){
                reject(new Error("Error while inserting data in database."));
            }
            if(res.rowCount===1){
                resolve(true);
            }
            else{
                resolve(false);
            }
        });

    })
    
}

function doesDateExists(date){
    return new Promise((resolve, reject) => {
        pool.query(`SELECT "dateId" FROM dates WHERE date='${date}' `, (error,result)=>{
            if(error){
                reject(new Error("Error while searching date in database"));
            }
            if(result.rows.length===1){
                resolve(result.rows[0].dateId);
            }
            else{
                resolve(false);
            }
        });

    });
}

function doesDayInformationExists(date,user){
    return new Promise((resolve,reject)=>{
        pool.query(`SELECT "dateID", "userID" FROM user_dates
        WHERE "dateID" = '${date}' AND "userID"=(SELECT "userId" FROM "userTable" WHERE username='${user}')`,(error,result)=>{
            if(error){
                reject(new Error("trouble checking does information about the day already exists"));
            }
            if(result.rows.length===1){
                resolve(true);
            }
            else{
                resolve(false);
            }
        });
    })
   
}

function createDate(date){
    let formatedDate=new Date(date);
    return new Promise((resolve,reject)=>{
        pool.query(`INSERT INTO dates(date, day,month,year)
        VALUES ('${date}','${formatedDate.getDate()}','${formatedDate.getMonth()}','${formatedDate.getFullYear()}')
        RETURNING "dateId" `,(error,result)=>{
            if(error){
                reject(new Error("trouble creating date"));
            }
            resolve(result.rows[0].dateId);
        });
    })
}

exports.doesDateExists = doesDateExists;

exports.createDate = createDate;

