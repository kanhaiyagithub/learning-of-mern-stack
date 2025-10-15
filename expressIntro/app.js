//  const express = require('express')
//  const app = express();
//  app.use((req,res,next)=>{
//     console.log("came in first middleware and this is first middleware",req.url,req.method);
//     next();
//  })
//  app.use((req,res,next) =>{
//     console.log("came from second middleware and this is second middleware",req.url,req.method);
//     res.send("<p> welcome to the node js series </p>")
    
//  })
//  app.listen(3002,()=>{
//     console.log('server is listening on the port 3002');
    
//  })




//create a new project 
// install nodemon and express 
// add two dummy middleware that logs request path and request method respectivley 
// add a third middleware that logs request path and request method respectively 
// add the third middleware that return the response 
// now add handling using two more middlewarethat handel path /, a requestto /contact-us page 
// contact-us should have return a form with name and email as input field that submits to /contact-us page also 
// also handel POST incoming request to /contact-us path using seprate middleware


const express = require('express')
const app = express()
app.use((req,res,next)=>{
    console.log('URL and METHOD is',req.url,req.method);
    next()
})
app.use((req,res,next)=>{
    console.log('second url and method is ',req.url,req.method);
    next()
})
// app.use('/',(req,res,next)=>{
//     res.send('hii welcome to the learning of the express js ')
// })
app.get("/contact-us",(req,res,next)=>{
    res.send(
        `
        <h1> Please give your details here </h1>
<form action="/contact-us" method="POST">
    <input type="text" name ="name" placeholder="Enter your name" />
    <input type="email" name = "email" placeholder="enter your email here">
    <input type="Submit">
</form>
        `

    )
})
app.post("/contact-us",(req,res,next)=>{
    console.log("handling the /contact-us for POST",req.url,req.method);
    res.send("we will contact you shortly")
})

app.listen(3002,()=>{
    console.log('server is listening on the port 3002 ');
    
})