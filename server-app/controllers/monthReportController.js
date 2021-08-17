// var pool=require('../connectingDatabase');

// exports.monthInformation = async function(req,res){
//     let calEalten=await averageCalorieIntake(req.body);
//     let calSpent=await averageCalorieSpent(req.body);
//     let motivation= await averageMotivation(req.body);
//     res.statusCode=200;
//     res.json({"calEaten":calEalten,"calSpent":calSpent,"motivation":motivation});
//     res.end();
// }


// //calculating average number of cal eaten in month based on number of recipes in database which have value done set to true and calorie intake writen in user_dates table
// function averageCalorieIntake(item){
//      return new Promise((resolve,reject)=>{
//          let info={
//              dates:[],
//              total:0
//          };
//          pool.query(`SELECT date_user_recipe."dateID", SUM(recipe.calories) AS calories FROM date_user_recipe
//          INNER JOIN recipe ON recipe."recipeID"=date_user_recipe."recipeID"
//          WHERE date_user_recipe."dateID" IN (SELECT "dateId" FROM dates WHERE year='${item.year}' AND month='${item.month}')
//          AND date_user_recipe.done=true
//          AND date_user_recipe."userID" =(SELECT "userId" FROM "userTable" WHERE username='${item.name}')
//          GROUP BY date_user_recipe."dateID" `, (error,result)=>{
//              if(error){
//                 reject(new Error("Error getting sum of eaten calories."));
//              }
//              for(let i=0;i<result.rows.length;i++){
//                  info.dates.push(result.rows[i].dateID);
//                 info.total+=parseFloat(result.rows[i].calories);
//              }
//              pool.query(`SELECT SUM("calorieIntake") AS calories,"dateID" FROM user_dates
//              WHERE "dateID" IN (SELECT "dateId" FROM dates WHERE year='${item.year}' AND month='${item.month}' )
//              AND "userID" =(SELECT "userId" FROM "userTable" WHERE username='${item.name}') 
//              GROUP BY "dateID" `,(error,result)=>{
//                 if(error){
//                     reject(new Error("Error getting sum of eaten calories."));
//                  }
//                  for(let i=0;i<result.rows.length;i++){
//                     if(result.rows[i].calories!==0){
//                         info.total+=parseFloat(result.rows[i].calories);
//                         if(info.dates.indexOf(result.rows[i].dateID)===-1){
//                             info.dates.push(result.rows[i].dateID);
//                         }
//                     }
//                 }
//                  let cal=info.total/info.dates.length;
//                  resolve(cal);
//              });
//          });
//      })
//  }

//  function averageCalorieSpent(item){
//      let info={
//          total:0,
//          dates:[]
//      }
//      return new Promise((resolve,reject)=>{
//         pool.query(`SELECT SUM(plan.calories) AS calories, date_user_plan."dateID" FROM date_user_plan
//         INNER JOIN plan ON plan."planId"=date_user_plan."planID"
//         WHERE date_user_plan."dateID" IN (SELECT "dateId" FROM dates WHERE year='${item.year}' AND month='${item.month}')
//         AND date_user_plan.done=true
//         AND date_user_plan."userID" =(SELECT "userId" FROM "userTable" WHERE username='${item.name}')
//         GROUP BY date_user_plan."dateID" `, (error,result)=>{
//             if(error){
//                 reject(new Error("Error getting sum of spent calories."));
//             }
//             for(let i=0;i<result.rows.length;i++){
//                 info.dates.push(result.rows[i].dateID);
//                 info.total+=parseFloat(result.rows[i].calories);
//             }
//             pool.query(`SELECT SUM("calorieSpent") AS calories,"dateID" FROM user_dates
//                 WHERE "dateID" IN (SELECT "dateId" FROM dates WHERE year='${item.year}' AND month='${item.month}' )
//                 AND "userID" =(SELECT "userId" FROM "userTable" WHERE username='${item.name}') 
//                 GROUP BY "dateID" `,(error,result)=>{
//                     if(error){
//                         reject(new Error("Error getting sum of spent calories."));
//                     }
//                     for(let i=0;i<result.rows.length;i++){
//                         if(result.rows[i].calories!==0){
//                             info.total+=parseFloat(result.rows[i].calories);
//                             if(info.dates.indexOf(result.rows[i].dateID)===-1){
//                                 info.dates.push(result.rows[i].dateID);
//                             }
//                         }
//                     }
//                     let cal=info.total/info.dates.length;
//                     resolve(cal);
//                 });
//         });
//     });
//  }

//  function averageMotivation(item){
//     return new Promise((resolve,reject)=>{
//         pool.query(`SELECT "motivationLevel" FROM user_dates
//         WHERE "dateID" IN (SELECT "dateId" FROM dates WHERE year='${item.year}' AND month='${item.month}' )
//         AND "userID" =(SELECT "userId" FROM "userTable" WHERE username='${item.name}') `, (error,result)=>{
//             if(error){
//                 reject(new Error("Error getting average motivation level."));
//             }
//             let motivation=0;
//             let br=0;
//             for(let i=0;i<result.rows.length;i++){
//                 if(result.rows[i].motivationLevel!==0){
//                     motivation+=result.rows[i].motivationLevel;
//                     br+=1;
//                 }
//             }
//             let avgMotivation=motivation/br;
//             resolve(avgMotivation);
//         });
//     });
//  }
