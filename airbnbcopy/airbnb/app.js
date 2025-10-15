const express = require('express')
const path = require('path')
const userRouter = require("./router/userRouter")
const hostRouter = require("./router/hostRouter")
const rootDir = require("./utils/pathUtils")
const app = express()

app.use(express.urlencoded())
app.use(userRouter)
app.use("/host",hostRouter)
app.use(express.static(path.join(rootDir,'public')))
app.use((req,res,next)=>{
    // res.status(404).sendFile(path.join(__dirname,'views','404.html'))  --> this is also a way to serve a html file 

    //this is a advance way to serve a html file 
    res.status(404).sendFile(path.join(rootDir,'views','404.html')) 
})
app.listen(3003,()=>{
    console.log("server is listening on the port 3003");
    
}) 