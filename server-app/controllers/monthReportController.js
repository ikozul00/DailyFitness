var pool=require('../connectingDatabase');

exports.monthInformation = async function(req,res){
    let calEalten=await averageCalorieIntake(req.body);
    let calSpent=await averageCalorieSpentPlan(req.body);
    calSpent=await averageCalorieSpentExercise(req.body, calSpent);
    calSpent=await averageCalorieSpentAdditional(req.body,calSpent);
    let motivation= await averageMotivation(req.body);
    res.statusCode=200;
    res.json({"calEaten":calEalten,"calSpent":calSpent.total/calSpent.dates.length,"motivation":motivation});
    res.end();
}


//calculating average number of cal eaten in month based on calorie intake writen in user_dates table
function averageCalorieIntake(item){
     return new Promise((resolve,reject)=>{
            let total=0;
            let br=0;
             pool.query(`SELECT "calorieIntake","dateID" FROM user_dates
             WHERE "dateID" IN (SELECT "dateId" FROM dates WHERE year='${item.year}' AND month='${item.month}' )
             AND "userID" =(SELECT "userId" FROM "userTable" WHERE username='${item.name}')  `,(error,result)=>{
                if(error){
                    reject(new Error("Error getting sum of eaten calories."));
                 }
                 for(let i=0;i<result.rows.length;i++){
                    if(result.rows[i].calorieIntake!==0){
                        total+=parseFloat(result.rows[i].calorieIntake);
                        br++;
                    }
                }
                 let cal=total/br;
                 resolve(cal);
             });
     })
 }


//getting number of calories spent in month by suming up calories of plans with tag done
 function averageCalorieSpentPlan(item){
     let info={
         total:0,
         dates:[]
     }
     return new Promise((resolve,reject)=>{
        pool.query(`SELECT SUM(plan.calories) AS calories, date_user_plan."dateID" FROM date_user_plan
        INNER JOIN plan ON plan."planId"=date_user_plan."planID"
        WHERE date_user_plan."dateID" IN (SELECT "dateId" FROM dates WHERE year='${item.year}' AND month='${item.month}')
        AND date_user_plan.done=true
        AND date_user_plan."userID" =(SELECT "userId" FROM "userTable" WHERE username='${item.name}')
        GROUP BY date_user_plan."dateID" `, (error,result)=>{
            if(error){
                reject(new Error("Error getting sum of spent calories."));
            }
            for(let i=0;i<result.rows.length;i++){
                info.dates.push(result.rows[i].dateID);
                info.total+=parseFloat(result.rows[i].calories);
            }
            resolve(info);
        });
    });
 }

 //getting number of calories spent in month by suming up calories of exercises with tag done
 function averageCalorieSpentExercise(item, info){
    return new Promise((resolve,reject)=>{
        pool.query(`SELECT SUM(exercise.calories) AS calories, date_user_exercise."dateID" FROM date_user_exercise
        INNER JOIN exercise ON exercise."exerciseId"=date_user_exercise."exerciseID"
        WHERE date_user_exercise."dateID" IN (SELECT "dateId" FROM dates WHERE year='${item.year}' AND month='${item.month}')
        AND date_user_exercise.done=true
        AND date_user_exercise."userID" =(SELECT "userId" FROM "userTable" WHERE username='${item.name}')
        GROUP BY date_user_exercise."dateID" `, (error,result)=>{
            if(error){
                reject(new Error("Error getting sum of spent calories."));
            }
            for(let i=0;i<result.rows.length;i++){
                if(info.dates.indexOf(result.rows[i].dateID)===-1){
                     info.dates.push(result.rows[i].dateID);
                }
                info.total+=parseFloat(result.rows[i].calories);
            }
            resolve(info);
        });
    });
 }

 //calculating number of cal eaten in month based on calorie spending writen in user_dates table
 function averageCalorieSpentAdditional(item,info){
     return new Promise((resolve, reject) => {
        pool.query(`SELECT "calorieSpent" AS calories,"dateID" FROM user_dates
        WHERE "dateID" IN (SELECT "dateId" FROM dates WHERE year='${item.year}' AND month='${item.month}' )
        AND "userID" =(SELECT "userId" FROM "userTable" WHERE username='${item.name}') `,(error,result)=>{
            if(error){
                reject(new Error("Error getting sum of spent calories."));
            }
            for(let i=0;i<result.rows.length;i++){
                if(result.rows[i].calories!==0){
                    info.total+=parseFloat(result.rows[i].calories);
                    if(info.dates.indexOf(result.rows[i].dateID)===-1){
                        info.dates.push(result.rows[i].dateID);
                    }
                }
            }
            resolve(info);
        });
     });
 }

 function averageMotivation(item){
    return new Promise((resolve,reject)=>{
        pool.query(`SELECT "motivationLevel" FROM user_dates
        WHERE "dateID" IN (SELECT "dateId" FROM dates WHERE year='${item.year}' AND month='${item.month}' )
        AND "userID" =(SELECT "userId" FROM "userTable" WHERE username='${item.name}') `, (error,result)=>{
            if(error){
                reject(new Error("Error getting average motivation level."));
            }
            let motivation=0;
            let br=0;
            for(let i=0;i<result.rows.length;i++){
                if(result.rows[i].motivationLevel!==0){
                    motivation+=result.rows[i].motivationLevel;
                    br+=1;
                }
            }
            let avgMotivation=motivation/br;
            resolve(avgMotivation);
        });
    });
 }
