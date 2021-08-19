var pool=require('../connectingDatabase');
let planController=require('./planController');
let dayController = require('./dayController');
const { getPicture } = require('./pictureController');

//getting data about one exercise and sending it to frontend
exports.getExerciseInfo = async function(req,res){
    let exercise = await getExercise(req);
    if(!exercise){
        res.json({"exercise":null});
    }
    else{
        exercise.favorite = await exerciseFavorite(exercise.exerciseId, req.query.user);
        res.json({"exercise":exercise});
    }
}
//getting data about one exercise and its tags from database and returning it
function getExercise(req){
    return new Promise((resolve, reject) => {
        pool.query(`SELECT title, "exerciseId", calories,content,"planTag", private,description, picture FROM exercise
        LEFT JOIN "exercise_planTag" ON "exercise_planTag"."exerciseID"=exercise."exerciseId"
        LEFT JOIN "planTags" ON "planTags"."planTagId"="exercise_planTag"."planTagID"
        WHERE title='${req.query.title}' AND "userID" =(SELECT "userId" FROM "userTable"
        WHERE username='${req.query.author}')`,(error,result) => {
            if (error){
                reject(new Error("Error retriving exercise from database."));
            }
            if(result.rows.length===0){
                resolve(false);
            }
            else{
               let exercise={};
               exercise.exerciseId=result.rows[0].exerciseId;
               exercise.calories=result.rows[0].calories;
               exercise.content=result.rows[0].content;
               exercise.privateEx=result.rows[0].private;
               exercise.description=result.rows[0].description;
               exercise.tags=[];
               exercise.favorite=false;
               exercise.img=result.rows[0].picture;
               for(let i=0;i<result.rows.length;i++){
                   exercise.tags.push(result.rows[i].planTag);
               }
              resolve(exercise);
            }
        });
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

function exerciseFavorite(exerciseId,user){
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM "exerciseSaved"
        WHERE "exerciseID" = '${exerciseId}' AND "userID" = (SELECT "userId" FROM "userTable" 
        WHERE username='${user}')`, (error,result) => {
            if(error){
                reject(new Error("Error checking if exercise is put in favorites."));
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


exports.toggleExerciseFavorite = async function (req,res){
    let saved = await exerciseFavorite(req.body.exerciseId, req.body.user);
    if(saved && !req.body.save){
        pool.query(`DELETE FROM "exerciseSaved" 
        WHERE "exerciseID"='${req.body.exerciseId}' AND "userID" = (SELECT "userId" FROM "userTable"
        WHERE username='${req.body.user}' )
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

    else if(!saved && req.body.save){
        let userId = await planController.getUserId(req.body.user);
        if(!userId){
            res.json({"success":false});
        }
        else{
            pool.query(`INSERT INTO "exerciseSaved" ("userID", "exerciseID")
            VALUES ('${userId}', '${req.body.exerciseId}' )
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
    }

    else{
        res.json({"success":false});
    }
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
            let picture="";
            if(req.files){
                picture=req.files.exerciseImg;
                picture.mv("./public/images/"+picture.name);
            }
            let exerciseId=await insertExerciseInDB(req,userID,picture);
            if(!exerciseId){
                res.json({"success":false,"exists":false});
            }
            else{
                let tags=JSON.parse(req.body.tags);
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


function insertExerciseInDB(req,userID,picture){
    return new Promise((resolve,reject) => {
        let pictureUrl;
        if(picture===""){
            pictureUrl="";
        }
        else{
            pictureUrl="/images/"+picture.name;
        }
        pool.query(`INSERT INTO exercise (title,description,calories,"userID",private,content,picture)
        VALUES ('${req.body.title}', '${req.body.description}', '${req.body.calories}', '${userID}', '${req.body.private}', '${req.body.content}', '${pictureUrl}')
        RETURNING "exerciseId" `,(error,result) => {
            if(error){
                throw error;
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
                success = await deleteExerciseFavoriteConnection(exerciseId);
                if(!success){
                    res.json({"success":false});
                }
                else{
                    success = await deleteExerciseDateConnection(exerciseId);
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

function deleteExerciseFavoriteConnection(exerciseId,username){
    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM "exerciseSaved"
        WHERE "exerciseID"='${exerciseId}' `, (error,result) => {
            if(error){
                reject(new Error("Error deleting connection between exercise and favorite."));
            }
            resolve(true);
        });
    });  
}

function deleteExerciseDateConnection(exerciseId, username){
    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM date_user_exercise
        WHERE "exerciseID"='${exerciseId}'`, (error,result) => {
            if(error){
                reject(new Error("Error deleting connection between exercise and date."));
            }
            resolve(true);
        });
    });  
}

//add infrormation about connection between exercise,date and user in database, so it can be displayed in calendar
exports.addExerciseToDB = async function (req,res){
    let dateId=await dayController.doesDateExists(req.body.date);
    if(!dateId){
        dateId=await dayController.createDate(req.body.date);
    }

    let userId= await planController.getUserId(req.body.username);
    if(!userId){
        res.json({"status":false,"exists":false});
    }
    else{
        let exerciseId = await getExerciseID(req.body.title,req.body.username);
        if(!exerciseId){
            res.json({"status":false,"exists":false});
        }
        else{
            let exists=await dataExistsDB(userId,exerciseId,dateId);
            if(exists){
                res.json({"status":false,"exists":true});
            }
            else{
                pool.query(`INSERT INTO date_user_exercise ("userID","exerciseID","dateID",timestamp,done)
                VALUES ('${userId}', '${exerciseId}', '${dateId}', '${new Date().toDateString()}', false)
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

//check if row that connects date,user and exercise already exsists
function dataExistsDB(userId,exerciseId,dateId){
    return new Promise((resolve,reject) =>{
        pool.query(`SELECT * FROM date_user_exercise 
        WHERE "exerciseID"='${exerciseId}' AND "userID"='${userId}' AND "dateID"='${dateId}' `,(error,result) => {
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

exports.getTagId = getTagId;
