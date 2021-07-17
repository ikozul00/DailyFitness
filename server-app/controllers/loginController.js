var pool=require('../connectingDatabase');
const bcrypt=require('bcrypt');

exports.checkUser=function(req,res){
    pool.query(`SELECT password FROM "userTable" WHERE username='${req.body.name}' `, (error, results) => {
        if (error) {
          throw error
        }
        if(results.rows[0]){
          console.log(req.body.name,req.body.password);
          bcrypt.compare(req.body.password, results.rows[0].password, function(err, response){
            if(response){
              res.json({"correct":true});
            }
            else{
              res.json({"correct":false});
            }
          });
        }
        else{
          res.json({"correct":false});
        }
    })
}