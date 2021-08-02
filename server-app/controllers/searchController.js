var pool=require('../connectingDatabase');

//function which retrives list of all plans from database whose title or author name is similar to search text
function searchResult(req,identical){
    return new Promise((resolve,reject) => {
        let query=`SELECT title,description,calories,username FROM `+req.query.type+ 
        ` INNER JOIN "userTable" ON "userTable"."userId"=`+req.query.type+`."userID"
        WHERE (private=false) AND (username LIKE '%`+req.query.value+`%' OR title LIKE '%`+req.query.value+`%')`;
        pool.query(query,(error,result) => {
            if(error){
                reject(new Error("Error searching for data."));
            } 
        let list=identical;
        let exsists=false;
        for(let i=0;i<result.rows.length;i++){
            exsists=false;
            for(let j=0;j<identical.length;j++){
                if(result.rows[i].title===identical[j].title && result.rows[i].description===identical[j].description && result.rows[i].calorie===identical[j].calorie && result.rows[i].username===identical[j].username){
                    exsists=true;
                }
            }
            if(!exsists){
                list.push(result.rows[i]);
            }
            
        }
        resolve(list);
        });
    });

}

//function which retrives list of all plans from database whose title or author name is identical to search text
function searchIdentical(type,value){
    return new Promise((resolve,reject) => {
        let query=`SELECT title,description,calories,username FROM `+type+ 
        ` INNER JOIN "userTable" ON "userTable"."userId"=`+type+`."userID"
        WHERE (private=false) AND (username='${value}' OR title='${value}')`;
        pool.query(query,(error,result) => {
            if(error){
                reject(new Error("Error searching for data."));
            } 
          resolve(result.rows);
        });
    })
}

//function which is called when search request is made using search box
exports.searchByName=async function(req,res){
    let identical=await searchIdentical(req.query.type,req.query.value);
    let list=await searchResult(req,identical);
    for(let i=0;i<list.length;i++){
        list[i]=await getTagsPlans(list[i]);
    } 
    res.json({"list":list});

}

//function which recives request for searching by tags
exports.searchByTags=async function (req,res){
    let queryTags="";
    //formates tags from request so we can put them in SQL expression
    for(let i=0;i<req.body.tags.length-1;i++){
        queryTags=queryTags+`'`+req.body.tags[i]+`', `;
    }
    queryTags=queryTags+`'`+req.body.tags[req.body.tags.length-1]+`'`;
    if(req.body.type=="plan"){
        //wait while we get list of plans which contain those tags
        let list=await getPlansByTags(queryTags);
        for(let i=0;i<list.length;i++){
            //add tags to list of plans
            list[i]=await getTagsPlans(list[i]);
        }
        res.json({"list":list});
    }
    else if(req.body.type=="exercise"){
        //wait while we get list of exercises which contain those tags
        let list=await getExercisesByTags(queryTags);
        for(let i=0;i<list.length;i++){
            //add tags to list of plans
            list[i]=await getTagsExercises(list[i]);
        }
        res.json({"list":list});
    }
}


//gets plans from database which have wanted tags
function getPlansByTags(queryTags){
    return new Promise((resolve,reject) => {
        let query=`SELECT title,description,calories, COUNT(plan."planId"),username FROM plan 
        INNER JOIN "plan_planTags" ON "plan_planTags"."planID"=plan."planId"
        INNER JOIN "planTags" ON "planTags"."planTagId"="plan_planTags"."planTagID"
        INNER JOIN "userTable" ON plan."userID"="userTable"."userId"
        WHERE private=false AND "planTag" IN (`+queryTags+`) 
        GROUP BY plan."planId",username
        ORDER BY COUNT(plan."planId") DESC`;
        pool.query(query,(error,result) => {
            if(error){
                reject(new Error("Error while searching plans by tags."));
            } 
         resolve(result.rows);
        });
});
}

function getExercisesByTags(queryTags){
    return new Promise((resolve,reject) => {
        let query=`SELECT title,description,calories, COUNT(exercise."exerciseId"),username FROM exercise
        INNER JOIN "exercise_planTag" ON "exercise_planTag"."exerciseID"=exercise."exerciseId"
        INNER JOIN "planTags" ON "planTags"."planTagId"="exercise_planTag"."planTagID"
        INNER JOIN "userTable" ON exercise."userID"="userTable"."userId"
        WHERE private=false AND "planTag" IN (`+queryTags+`) 
        GROUP BY exercise."exerciseId",username
        ORDER BY COUNT(exercise."exerciseId") DESC`;
        pool.query(query,(error,result) => {
            if(error){
                reject(new Error("Error while searching exercise by tags."));
            } 
         resolve(result.rows);
        });
});
}

//retrives tags which are connected with plan, which is argument of a function
function getTagsPlans(list){
    return new Promise((resolve,reject) => {
        list.tags=[];
            pool.query(`SELECT "planTag" FROM "planTags"
            INNER JOIN "plan_planTags" ON "plan_planTags"."planTagID"="planTags"."planTagId"
            WHERE "planID"= (SELECT "planId" FROM plan WHERE title='${list.title}' AND description='${list.description}' AND calories='${list.calories}')`, (error2,result2) =>{
                if(error2){
                    reject(new Error("Error retriving tags connected to a plan."));
                }
                for(let j=0;j<result2.rows.length;j++){
                    list.tags.push(result2.rows[j].planTag);
                }
                resolve(list);
        });
    });
}


//retrives tags which are connected with exercise, which is argument of a function
function getTagsExercises(list){
    return new Promise((resolve,reject) => {
        list.tags=[];
            pool.query(`SELECT "planTag" FROM "planTags"
            INNER JOIN "exercise_planTag" ON "exercise_planTag"."planTagID"="planTags"."planTagId"
            WHERE "exerciseID"= (SELECT "exerciseId" FROM exercise WHERE title='${list.title}' AND description='${list.description}' AND calories='${list.calories}')`, (error2,result2) =>{
                if(error2){
                    reject(new Error("Error retriving tags connected to aexercise."));
                }
                for(let j=0;j<result2.rows.length;j++){
                    list.tags.push(result2.rows[j].planTag);
                }
                resolve(list);
        });
    });
}