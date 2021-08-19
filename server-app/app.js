const express=require('express');
const app=express();
const port=3080
var router=require('./routes');
var cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');



app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// enable files upload
app.use(fileUpload({
    createParentPath: true,
    limits: { 
        fileSize: 2 * 1024 * 1024 * 1024 //2MB max file(s) size
    },
}));

//making files inside public directory avaliable to frontend
app.use(express.static('public'));

app.use('/api',router);
app.get('/api',(req,res)=>{
    res.send('Hello word')
})


app.listen(port,()=>{
    console.log(`Example app listening at http://localhost:${port}`)
})