const jwt= require('jsonwebtoken')
const {JWT_SECRET}=require('../keys')
const mongoose= require('mongoose')
const User=mongoose.model("User")
module.exports=(req,res,next)=>{
    const {authorization} =req.headers
    if(!authorization){
        res.send('Please Login')
    }

    const token=authorization.replace("Bearer ","")
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
            res.send('You Must be logged in')
        }

        const {_id}=payload
        User.findById(_id).then(userdata=>{
            req.user=userdata
        })

        next()
    })
}