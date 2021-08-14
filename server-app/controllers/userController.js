var pool=require('../connectingDatabase');
const planController = require('./planController');

exports.getUserData = async function (req,res){
    let exists = await planController.getUserId(req.query.name);
    if(!exists){
        res.json({"user":null});
    }
    else{
        pool.query(`SELECT email,age,weight,height FROM "userTable"
        WHERE username='${req.query.name}' `, (error, result) => {
            if(error){
                throw error;
            }
            if(result.rows.length===0){
                res.json({"user":null});
            }
            else{
                let user=result.rows[0];
                res.json({"user":{"email":user.email,"age":user.age,"weight":user.weight,"height":user.height}});
            }
        });
    }
}