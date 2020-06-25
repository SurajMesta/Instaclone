const express= require('express')
const router=express.Router()
const mongoose= require('mongoose')
const User= mongoose.model('User')
const bcrypt= require('bcryptjs')
const jwt= require('jsonwebtoken')
const {JWT_SECRET}=require('../keys')
const requireLogin= require('../middleware/requireLogin')


router.get('/',(req,res)=>{
    res.send('Hello')
})

router.post('/signup',(req,res)=>{
     const {name,password,email}=req.body
    if(!name || !password || !email){
        return res.status(422).json({error:'Please Enter All the Fields'})
    }
    User.findOne({email:email}).then(data=>{
        if(data){
            return res.status(422).json({error:'Email Already Exists. Please Use different one'})
        }

        else{
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(password,salt,(err,hash)=>{
                    let user= new User({name,password:hash,email})

                    user.save().then(myData=>{
                        res.send('Data Save Success')
                    }).catch(err=>{
                        res.send('Data Save Failed')
                    })

                })
            })

        }



    }).catch(err=>{
       res.send('Error')
    })
})

router.post('/signin',(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
        res.send('Please Enter Email and Password')
    }
    else{
        User.findOne({email:email}).then(data=>{
            if(data){
                bcrypt.compare(password,data.password,(err,isMatch)=>{
                    if(isMatch){
                        const token=jwt.sign({_id:data._id},JWT_SECRET)
                        res.send(token)
                    }
                    else{
                        res.send('Email/Password is Wrong')
                    }
                })
            }

            else{
                res.send('Email/Password is Wrong')
            }
        })
    }


})

router.get('/protected',requireLogin,(req,res)=>{
    res.send('Hello')
})


module.exports=router