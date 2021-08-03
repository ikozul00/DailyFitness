var pool=require('../connectingDatabase');

exports.getExercise = function(req,res){
    pool.query(`SELECT title, calories,content,"planTag" FROM exercise
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
           exercise.tags=[];
           for(let i=0;i<result.rows.length;i++){
               exercise.tags.push(result.rows[i].planTag);
           }
           res.json({"exercise":exercise});
        }
    });
}

