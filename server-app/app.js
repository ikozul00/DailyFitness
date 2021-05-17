const express=require('express');
const app=express();
const port=3080
var router=require('./routes');
var cors = require('cors');



app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());


app.use('/api',router);
app.get('/api',(req,res)=>{
    res.send('Hello word')
})


app.listen(port,()=>{
    console.log(`Example app listening at http://localhost:${port}`)
})