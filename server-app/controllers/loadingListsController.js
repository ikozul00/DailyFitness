var pool=require('../connectingDatabase');
const registration=require('./registrationController');

exports.retriveMy = async function(req,res){
    let exists = await registration.checkExistingUser(req.body.name);
    if(exists){
        let list=await getMy(req);
        if(req.body.value==="plan"){
            for(let i=0;i<list.length;i++){
                list[i]=await getTagsPlans(list[i]);
            }
        }
        else if(req.body.value==="exercise"){
            for(let i=0;i<list.length;i++){
                list[i]=await getTagsExercises(list[i]);
            }
        }
        res.json({"list":list});
    }
}

function getMy(req){
    return new Promise((resolve,reject) => {
        let query=`SELECT title,description, calories, username, private FROM `+req.body.value+`
        INNER JOIN "userTable" on "userTable"."userId"= `+req.body.value+`."userID"
        WHERE username='${req.body.name}' `;
        pool.query(query,(error,result) => {
            if(error){
                reject(new Error("Error retriving plans from database."));
            }
            let list=[];
            if(req.body.size===0 || result.rows.length<req.body.size){
                resolve(result.rows);
            }
            else{
                for(let i=0;i<req.body.size;i++){
                    list.push(result.rows[i]);
                }
                resolve(list);
            }
        });
    });
}

exports.retriveAll = async function(req,res){
    let list= await getAll(req);
    if(req.query.value==="plan"){
        for(let i=0;i<list.length;i++){
            list[i]=await getTagsPlans(list[i]);
        }
    }
    else if(req.query.value==="exercise"){
        for(let i=0;i<list.length;i++){
            list[i]=await getTagsExercises(list[i]);
        }
    }
    
    res.json({"list":list});
}

function getAll(req){
    return new Promise((resolve,reject) => {
        let query=`SELECT title,description, calories, username, private FROM `+req.query.value+
        ` INNER JOIN "userTable" on "userTable"."userId"=`+req.query.value+`."userID"
         WHERE private=false `
         pool.query(query,(error,result) => {
                 if(error){
                    reject(new Error("Error retriving plans from database."));
                 } 
                 let list=[];
                 let size=parseInt(req.query.size);
                 if(size===0 || result.rows.length<size){
                     resolve(result.rows);
                 }
                 else{
                     for(let i=0;i<size;i++){
                         list.push(result.rows[i]);
                     }
                     resolve(list);
                 }
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