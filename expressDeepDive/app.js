const express = require('express')
const bodyparser = require('body-parser')
const app = express()
app.get('/contact-us',(req,res,next)=>{
    res.send(`
        <h1>Please give your details here </h1>
<form action="/contact-us" method = "post">
<input type="text" name ="name" placeholder="Enter your name here">
<input type="email" name="email" placeholder="Enter your email here">
<input type="Submit">
</form>
        `)
})
app.use(bodyparser.urlencoded())

app.post("/contact-us",(req,res,next)=>{
    console.log("Handling contact-us for POST", req.url,req.method,req.body);
    
    res.send("we will contact you shortly")
})
app.listen(3002,()=>{
    console.log("server is listening on the port 3002");
    
})