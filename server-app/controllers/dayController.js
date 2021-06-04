const { response } = require('express');
var pool=require('../connectingDatabase');


//loading information about one day
exports.dayInformation=function(req,res){
    var information={
        exercises:[],
        meals:[],
        mealsOutOfPlan:[],
        plannedCalSpent:0,
        plannedCalEaten:0,
        calSpent:0,
        calEaten:0,
        calEatenOutOfPlan:0,
        calSpentOutOfPlan:0,
        weight:0,
        motivation:0,
        notes:0,
    }

    console.log(req.body);
    //reaching information about plans
    pool.query(`SELECT plan.title,date_user_plan.done,plan.calories,"userTable".username FROM plan
    INNER JOIN date_user_plan ON plan."planId"=date_user_plan."planID"
    INNER JOIN dates ON date_user_plan."dateID"=dates."dateId"
    INNER JOIN "userTable" ON plan."userID"="userTable"."userId"
    WHERE date_user_plan."userID"=(SELECT "userId" FROM "userTable" WHERE username='${req.body.name}') AND dates.date='${req.body.date}' `, (error,result)=>{
        if(error){
            throw error;
        }
        for(let i=0;i<result.rows.length;i++){
            let data=[result.rows[i].title,result.rows[i].username,result.rows[i].calories,result.rows[i].done,];
            if(result.rows[i].done){
                information.calSpent+=result.rows[i].calories;
            }
            information.plannedCalSpent+=result.rows[i].calories;
            information.exercises.push(data);

        }
        
        //reaching information about meals
        pool.query(`SELECT recipe.title,date_user_recipe.planned,date_user_recipe.done,recipe.calories,"userTable".username FROM recipe
        INNER JOIN date_user_recipe ON recipe."recipeID"=date_user_recipe."recipeID"
        INNER JOIN dates ON date_user_recipe."dateID"=dates."dateId"
        INNER JOIN "userTable" ON recipe."userID"="userTable"."userId"
        WHERE date_user_recipe."userID"=(SELECT "userId" FROM "userTable" WHERE username='${req.body.name}') AND dates.date='${req.body.date}' `, (error,result)=>{
            if(error){
                throw error;
            }
            for(let i=0;i<result.rows.length;i++){
                let data=[result.rows[i].title,result.rows[i].username,result.rows[i].calories,result.rows[i].done];
                if(result.rows[i].planned){
                    information.meals.push(data);
                    if(result.rows[i].done){
                        information.calEaten+=result.rows[i].calories;
                    }
                    information.plannedCalEaten+=result.rows[i].calories;
                }
                else{
                    data[3]=true;
                    information.mealsOutOfPlan.push(data);
                    information.calEaten+=result.rows[i].calories;
                }
            }
            pool.query(`SELECT "calorieIntake", "calorieSpent", weight, "motivationLevel",notes FROM user_dates
            WHERE "userID"=(SELECT "userId" FROM "userTable" WHERE username='${req.body.name}')
            AND "dateID"=(SELECT "dateId" FROM dates WHERE date='${req.body.date}' )`,(error,result)=>{
                if(error){
                    throw error;
                }
                if(result.rows.length===0){
                        pool.query(`SELECT weight FROM "userTable" WHERE username='${req.body.name}' `,(error,result)=>{
                            if(error){
                                throw error;
                            }
                            else{
                                information.weight=result.rows[0].weight;
                                res.json({"information":information});
                            }
                        });
                }
                else{
                    information.calEatenOutOfPlan=result.rows[0].calorieIntake;
                    information.calSpentOutOfPlan=result.rows[0].calorieSpent;
                    information.motivation=result.rows[0].motivationLevel;
                    information.notes=result.rows[0].notes;
                    if(result.rows[0].weight){
                        information.weight=result.rows[0].weight;
                        res.json({"information":information});
                    }
                    else{
                        pool.query(`SELECT weight FROM "userTable" WHERE username='${req.body.name}' `,(error,result)=>{
                            if(error){
                                throw error;
                            }
                            else{
                                information.weight=result.rows[0].weight;
                                res.json({"information":information});
                            }
                        });
                    }
                }
            });           
        });
    });

}


//updating information about exercises status
exports.exerciseDone = function(req,res){
    pool.query(`UPDATE date_user_plan SET done='${req.body.done}'
    WHERE "userID"=(SELECT "userId" FROM "userTable" WHERE username='${req.body.username}') 
    AND "planID"=(SELECT "planId" FROM plan WHERE title='${req.body.title}' AND "userID"=(SELECT "userId" FROM "userTable" WHERE username='${req.body.author}'))
    AND "dateID"=(SELECT "dateId" FROM dates WHERE date='${req.body.date}' ) `,(error,result)=>{
        if(error){
            throw error;
        }

        if(result.rowCount===1){
            //returnin modified exercise list
           exerciseInformation(req,res);
        }
        else{
            res.statusCode=404;
            res.json({"message":"Update unsuccessful"});
            res.end();
        }
    });
}

//updating meal status
exports.mealDone= function(req,res){
    pool.query(`UPDATE date_user_recipe SET done='${req.body.done}'
    WHERE "userID"=(SELECT "userId" FROM "userTable" WHERE username='${req.body.username}') 
    AND "recipeID"=(SELECT "recipeID" FROM recipe WHERE title='${req.body.title}' AND "userID"=(SELECT "userId" FROM "userTable" WHERE username='${req.body.author}'))
    AND "dateID"=(SELECT "dateId" FROM dates WHERE date='${req.body.date}' ) `,(error,result)=>{
        if(error){
            throw error;
        }
        if(result.rowCount===1){
            //returning modified meal list
           mealsInformation(req,res);
        }
        else{
            res.statusCode=404;
            res.json({"message":"Update unsuccessful"});
            res.end();
        }

    });
}


//retriving meals list
function mealsInformation(req,res){
    var information={
        meals:[],
        plannedCalEaten:0,
        calEaten:0,
        mealsOutOfPlan:[]
    }
    pool.query(`SELECT recipe.title,date_user_recipe.planned,date_user_recipe.done,recipe.calories,"userTable".username FROM recipe
    INNER JOIN date_user_recipe ON recipe."recipeID"=date_user_recipe."recipeID"
    INNER JOIN dates ON date_user_recipe."dateID"=dates."dateId"
    INNER JOIN "userTable" ON recipe."userID"="userTable"."userId"
    WHERE date_user_recipe."userID"=(SELECT "userId" FROM "userTable" WHERE username='${req.body.username}') AND dates.date='${req.body.date}' `, (error,result)=>{
        if(error){
            throw error;
        }
        for(let i=0;i<result.rows.length;i++){
            let data=[result.rows[i].title,result.rows[i].username,result.rows[i].calories,result.rows[i].done];
            if(result.rows[i].planned){
                information.meals.push(data);
                if(result.rows[i].done){
                    information.calEaten+=result.rows[i].calories;
                }
                information.plannedCalEaten+=result.rows[i].calories;
            }
            else{
                data[3]=true;
                information.mealsOutOfPlan.push(data);
                information.calEaten+=result.rows[i].calories;
            }
        }
        res.statusCode=200;
        res.json({"message":"Update successful","information":information});
        res.end();
    });
}

//retriving exercise list
function exerciseInformation(req,res){
    var information={
        exercises:[],
        plannedCalSpent:0,
        calSpent:0,
    }
    pool.query(`SELECT plan.title,date_user_plan.done,plan.calories,"userTable".username FROM plan
    INNER JOIN date_user_plan ON plan."planId"=date_user_plan."planID"
    INNER JOIN dates ON date_user_plan."dateID"=dates."dateId"
    INNER JOIN "userTable" ON plan."userID"="userTable"."userId"
    WHERE date_user_plan."userID"=(SELECT "userId" FROM "userTable" WHERE username='${req.body.username}') AND dates.date='${req.body.date}' `, (error,result)=>{
        if(error){
            throw error;
        }
        for(let i=0;i<result.rows.length;i++){
            let data=[result.rows[i].title,result.rows[i].username,result.rows[i].calories,result.rows[i].done,];
            if(result.rows[i].done){
                information.calSpent+=result.rows[i].calories;
            }
            information.plannedCalSpent+=result.rows[i].calories;
            information.exercises.push(data);
        }
        res.statusCode=200;
        res.json({"message":"Update successful","information":information});
        res.end();
    });
}

//deleting exercise plan from a schedule
exports.removeExercisePlan=function(req,res){
    pool.query(`DELETE FROM date_user_plan WHERE "dateID"=(SELECT "dateId" FROM dates WHERE date='${req.body.date}')
    AND "planID"=(SELECT "planId" FROM plan WHERE title='${req.body.title}' AND "userID"=(SELECT "userId" FROM "userTable" WHERE username='${req.body.author}'))
    AND "userID"=(SELECT "userId" FROM "userTable" WHERE username='${req.body.username}' ) `, (error,result)=>{
        if(error){
            throw error;
        }
        if(result.rowCount===1){
            //returning modified exercise list
           exerciseInformation(req,res);
        }
        else{
            res.statusCode=404;
            res.json({"message":"Update unsuccessful"});
            res.end();
        }
    });
}

//deleting meal plan from a schedule
exports.removeMealPlan = function(req,res){
    pool.query(`DELETE FROM date_user_recipe WHERE "dateID"=(SELECT "dateId" FROM dates WHERE date='${req.body.date}')
    AND "recipeID"=(SELECT "recipeID" FROM recipe WHERE title='${req.body.title}' AND "userID"=(SELECT "userId" FROM "userTable" WHERE username='${req.body.author}'))
    AND "userID"=(SELECT "userId" FROM "userTable" WHERE username='${req.body.username}' ) `, (error,result)=>{
        if(error){
            throw error;
        }
        if(result.rowCount===1){
            //returning modified meal list
           mealsInformation(req,res);
        }
        else{
            res.statusCode=404;
            res.json({"message":"Update unsuccessful"});
            res.end();
        }
    });
}

//updating databse with information user has entered about one date
exports.modifyDayInformation = async function(req,res){
    console.log(req.body);
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
                console.log(result.rowCount);
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
            console.log("inside doesDateExists",result.rows.length);
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
            console.log(result.rows[0].dateId);
            resolve(result.rows[0].dateId);
        });
    })
}

