var pool=require('../connectingDatabase');
const { checkUser } = require('./loginController');
const bcrypt=require('bcrypt');

exports.insertUser= async function(req,res){
    let exists= await checkExistingUser(req.body.name);
    if(!exists){
        let userRole="user";
        bcrypt.hash(req.body.password, 10, function(err, hash){
        pool.query(`INSERT INTO "userTable"(username,password,email,role,weight,height,age) VALUES ('${req.body.name}','${hash}','${req.body.email}','${userRole}','${req.body.weight}','${req.body.height}','${req.body.age}') `,(error,result)=>{
            if(error){
                throw error;
            }
            else{
                res.json({"correct":true});
            }
        })
    });
    }
    else{
        res.json({"correct":false});
    }
}

//using promise to check if user already exists in database, if exists return true, else false
exports.checkExistingUser = function (name){
    return new Promise((resolve,reject)=>{
        pool.query(`SELECT username FROM "userTable" WHERE username='${name}' `, (error,result)=>{
            if(error){
                reject(new Error("Error checking if user exists."));
            }
            console.log(result.rows.length);
            let exist=false;
            if(result.rows.length!==0){
                exist=true;
            }
            else{
                exist=false;
            }
            resolve(exist);
        })
    });   
}