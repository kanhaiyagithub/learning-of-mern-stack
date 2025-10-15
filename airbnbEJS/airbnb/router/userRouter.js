const path = require('path')
const express = require('express')
const userRouter = express.Router()
const rootDir = require("../utils/pathUtils")

userRouter.get("/",(req,res,next)=>{
    // res.sendFile(path.join(__dirname, "../",'views','home.html')) --> this is a correct way to do but this is overhead always as in this we have to manually see the path everytime another way is 
    res.sendFile(path.join(rootDir,'views','home.html')) 
})
module.exports = userRouter;