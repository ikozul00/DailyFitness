var pool=require('../connectingDatabase');
let planController=require('./planController');

//getting data about one exercise and its tags from database and sending it to frontend
exports.getExercise = function(req,res){
    pool.query(`SELECT title, calories,content,"planTag", private,description FROM exercise
    LEFT JOIN "exercise_planTag" ON "exercise_planTag"."exerciseID"=exercise."exerciseId"
    LEFT JOIN "planTags" ON "planTags"."planTagId"="exercise_planTag"."planTagID"
    WHERE title='${req.query.title}' AND "userID" =(SELECT "userId" FROM "userTable"
    WHERE username='${req.query.author}')`,(error,result) => {
        if (error){
            throw error;
        }
        if(result.rows.length===0){
            res.json({"exercise":null});
        }
        else{
           let exercise={};
           exercise.calories=result.rows[0].calories;
           exercise.content=result.rows[0].content;
           exercise.privateEx=result.rows[0].private;
           exercise.description=result.rows[0].description;
           exercise.tags=[];
           for(let i=0;i<result.rows.length;i++){
               exercise.tags.push(result.rows[i].planTag);
           }
           res.json({"exercise":exercise});
        }
    });
}


//checking if exercise with title already exists in database
function getExerciseID(title,author){
    return new Promise((resolve,reject) => {
        pool.query(`SELECT "exerciseId" FROM exercise
        WHERE title='${title}' AND "userID" = (SELECT "userID" FROM "userTable"
        WHERE username='${author}' )`, (error,result) => {
            if(error){
                reject(new Error("Error checking if exercise exists in database."));
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

//creating new exercise in database
exports.createExercise = async function (req,res){
    let exists=await getExerciseID(req.body.title,req.body.username);
    if(exists){
        res.json({"success":false,"exists":true});
    }
    else{
        let userID = await planController.getUserId(req.body.username);
        if(!userID){
            res.json({"success":false,"exists":false});
        }
        else{
            let exerciseId=await insertExerciseInDB(req,userID);
            if(!exerciseId){
                res.json({"success":false,"exists":false});
            }
            else{
                let tags=req.body.tags;
                let success=true;
                for(let i=0;i<tags.length;i++){
                    let tagId= await getTagId(tags[i]);
                    if(!tagId){
                        success=false;
                        break;
                    }
                    success= await addTagToExercise(tagId,exerciseId);
                    if(!success){
                        break;
                    }
                }
                if(success){
                     res.json({"success":true,"exists":false});
                }
                else{
                    res.json({"success":false,"exists":false});
                }

            }
            // pool.query(`INSERT INTO exercise (title,description,calories,"userID",private,content)
            // VALUES ('${req.body.title}', '${req.body.description}', '${req.body.calories}', '${userID}', '${req.body.private}', '${req.body.content}')
            // RETURNING exerciseId `, (error,result) => {
            //     if(error){
            //         throw error;
            //     }
            //     if(result.rows.length===0){
            //         res.json({"success":false,"exists":false});
            //     }
            //     else{
            //         let tags=req.body.tags;
            //         let success=true;
            //         let exerciseId=result.rows[0].exerciseId;
            //         console.log(exerciseId);
            //        for(let i=0;i<tags.length;i++){
            //            let tagId= await getTagId(tags[i]);
            //            console.log(tagId);
            //            if(!tagId){
            //                success=false;
            //                break;
            //            }
            //            success= await addTagToExercise(tagId,exerciseId);
            //            if(!success){
            //                break;
            //            }
            //        }
            //        if(success){
            //         res.json({"true":false,"exists":false});
            //        }
            //        else{
            //         res.json({"success":false,"exists":false});
            //        }
            //     }
            // });
        }

    }

}

function getTagId(tag){
    return new Promise((resolve,reject) =>{
        pool.query(`SELECT "planTagId" FROM "planTags" WHERE "planTag"='${tag}' `,(error,result) => {
            if(error){
                reject(new Error("trouble getting tagId from database"));
            }
            if(result.rows.length===0){
                resolve(false);
            }
            else{
                resolve(result.rows[0].planTagId);
            }
        });

    });
}

function addTagToExercise(tagId,exerciseId){
    return new Promise((resolve,reject) =>{
        pool.query(`INSERT INTO "exercise_planTag" ("exerciseID","planTagID")
        VALUES ('${exerciseId}', '${tagId}' )
        RETURNING *`,(error,result) => {
            if(error){
                reject(new Error("trouble inserting exerciseID, planTagID in exercise_planTag"));
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

// function insertExerciseInDB(req,userID){
//     return new Promise((resolve,reject) =>{
//         pool.query(`INSERT INTO exercise (title,description,calories,"userID",private,content)
//             VALUES ('${req.body.title}', '${req.body.description}', '${req.body.calories}', '${userID}', '${req.body.private}', '${req.body.content}')
//             RETURNING exerciseId `, (error,result) => {
//                 if(error){
//                     reject(new Error("trouble inserting exercise in DB"));
//                 }
//                 if(result.rows.length===0){
//                     resolve(false);
//                 }
//                 else{
//                     resolve(result.rows[0].exerciseId);
//                 }
//             });

//     });
// }

function insertExerciseInDB(req,userID){
    return new Promise((resolve,reject) => {
        pool.query(`INSERT INTO exercise (title,description,calories,"userID",private,content)
        VALUES ('${req.body.title}', '${req.body.description}', '${req.body.calories}', '${userID}', '${req.body.private}', '${req.body.content}')
        RETURNING "exerciseId" `,(error,result) => {
            if(error){
                reject(new Error("trouble inserting exercise in DB"));
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

exports.deleteExercise = async function deleteExercise(req,res){
    let exerciseId = await getExerciseID(req.query.name, req.query.author);
    if(!exerciseId){
        res.json({"success":false});
    }
    else{
        let success=false;
        success = await deleteExerciseTagConnection(exerciseId);
        if(!success){
            res.json({"success":false});
        }
        else{
            success = await deleteExercisePlanConnection(exerciseId);
            if(!success){
                res.json({"success":false});
            }
            else{
                pool.query(`DELETE FROM exercise
                WHERE "exerciseId" = '${exerciseId}'
                RETURNING * `, (error,result) => {
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

function deleteExerciseTagConnection(exerciseId){
    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM "exercise_planTag"
        WHERE "exerciseID"='${exerciseId}' `, (error,result) => {
            if(error){
                reject(new Error("Error deleting connection between exercise and tag."));
            }
            resolve(true);
        });
    });  
}

function deleteExercisePlanConnection(exerciseId){
    return new Promise((resolve,reject) => {
        pool.query(`DELETE FROM plan_exercise
        WHERE "exerciseID"='${exerciseId}' `, (error,result) => {
            if(error){
                reject(new Error("Error deleting connection between plan and exercise."));
            }
            resolve(true);
        });
    });
}

exports.getTagId = getTagId;
