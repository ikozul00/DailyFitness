var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser');
var pool=require('./connectingDatabase');
const { response } = require('express');


//checking if user exists in database
router.post('/login', function (req, res){
    pool.query(`SELECT * FROM "userTable" WHERE username='${req.body.name}' AND password='${req.body.password}' `, (error, results) => {
      if (error) {
        throw error
      }
      if(results.rows[0]){
        res.json({"correct":true});
      }
      else{
        res.json({"correct":false});
      }
    })
  });
 

  module.exports = router