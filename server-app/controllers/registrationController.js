var pool=require('../connectingDatabase');
const { checkUser } = require('./loginController');
const bcrypt=require('bcrypt');

exports.insertUser=function(req,res){
    if(!checkExistingUser(req.body.name)){
        bcrypt.hash(req.body.password, 10, function(err, hash){
        pool.query(`INSERT INTO "userTable"(username,password,email,role,weight,height,age) VALUES ('${req.body.name}','${hash}','${req.body.email}',user,'${req.body.weight}','${req.body.height}','${req.body.age}') `,(error,result)=>{
            if(error){
                throw error;
            }
            else{
                console.log("Row inserted");
                res.json({"correct":true});
            }
        })
    });
    }
    else{
        res.json({"correct":false});
    }
}

function checkExistingUser(name){
    pool.query(`SELECT username FROM "userTable" WHERE username='${name}' `, (error,result)=>{
        if(error){
            throw error;
        }
        if(!result.rows[0]){
            return false;
        }
        else{
            return true;
        }
    })
}