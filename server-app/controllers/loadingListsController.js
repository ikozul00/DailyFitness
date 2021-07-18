var pool=require('../connectingDatabase');
const registration=require('./registrationController');

exports.retriveMy = async function(req,res){
    let exists = await registration.checkExistingUser(req.body.name);
    if(exists){
        let query=`SELECT title,description, calories, username FROM `+req.body.value+`
        INNER JOIN "userTable" on "userTable"."userId"= `+req.body.value+`."userID"
        WHERE username='${req.body.name}' `;
        pool.query(query,(error,result) => {
            if(error){
                throw error;
            }
            let list=[];
            if(req.body.size===0 || result.rows.length<req.body.size){
                res.json({"list":result.rows});
            }
            else{
                for(let i=0;i<req.body.size;i++){
                    list.push(result.rows[i]);
                }
                res.json({"list":list});
            }
        });
    }
}

exports.retriveAll = function(req,res){
    let query=`SELECT title,description, calories, username FROM `+req.query.value+
   ` INNER JOIN "userTable" on "userTable"."userId"=`+req.query.value+`."userID"
    WHERE private=false `
    pool.query(query,(error,result) => {
            if(error){
                throw error;
            } 
            let list=[];
            let size=parseInt(req.query.size);
            if(size===0 || result.rows.length<size){
                res.json({"list":result.rows});
            }
            else{
                for(let i=0;i<size;i++){
                    list.push(result.rows[i]);
                }
                res.json({"list":list});
            }
        });
}