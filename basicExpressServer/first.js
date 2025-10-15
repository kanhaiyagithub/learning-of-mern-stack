const express = require('express')
const app= express()
const path = require('path')
const bcrypt = require('bcryptjs');
//Hello route and logger middleware 
app.use((req,res,next) =>{
    console.log(`${req.method},${req.url}`);
    next();
})
app.get('/hello',(req,res)=>{
    res.send("hii this is from the hello endpoint")
})
//serving static file and checking the health endpoint
app.use('/public',express.static(path.join(__dirname,'public','index.html')))
app.get('/health',(req,res)=>{
    res.json({status:'ok',time : new Date()})
})
//register and bcrypt and in memory store 
app.use(express.json());
const user = {};
app.post('/register',async(req,res)=>{
    const {email,password,name} = req.body
    const hash = await bcrypt.hash(password,10);
    user[email] = {passwordHash: hash,name};
    res.status(201).json({email,name})
})
app.listen(3008,()=>{
    console.log('Server is listening on the port 3008');
    
})