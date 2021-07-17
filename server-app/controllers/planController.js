var pool=require('../connectingDatabase');
const registration=require('./registrationController');

exports.retriveMyPlans = async function(req,res){
    let exists = await registration.checkExistingUser(req.body.name);
    if(exists){
        pool.query(`SELECT title,description, calories, username FROM plan
        INNER JOIN "userTable" on "userTable"."userId"=plan."userID"
        WHERE username='${req.body.name}' `,(error,result) => {
            if(error){
                throw error;
            }
            let plans=[];
            if(req.body.size===0){
                res.json({"plans":result.rows});
            }
            else{
                if(result.rows.length<req.body.size){
                    for(let i=0;i<result.rows.length;i++){
                        plans.push(result.rows[i]);
                    }
                }
                else{
                    for(let i=0;i<req.body.size;i++){
                        plans.push(result.rows[i]);
                    }
                }
                res.json({"plans":plans});
            }
        });
    }
}

exports.retrivePlans = function(req,res){
    console.log("req",req);
    pool.query(`SELECT title,description, calories, username FROM plan
        INNER JOIN "userTable" on "userTable"."userId"=plan."userID"
        WHERE private=false `,(error,result) => {
            if(error){
                throw error;
            }
            
            let plans=[];
            if(req.query.size==='0'){
                console.log("0 je");
                res.json({"plans":result.rows});
            }
            else{
                if(result.rows.length<req.body.size){
                    for(let i=0;i<result.rows.length;i++){
                        plans.push(result.rows[i]);
                    }
                }
                else{
                    for(let i=0;i<req.query.size;i++){
                        plans.push(result.rows[i]);
                    }
                }
                res.json({"plans":plans});
            }
        });
}