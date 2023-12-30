const express = require('express');
const bcrypt = require('bcrypt');
const JWT_SECRET = require('../config/keys')
const jwt = require('jsonwebtoken');
const { User, Task } = require('../models/models');

const router = express.Router();

// User registration route
router.post('/register',(req,res)=>{
  const {username ,password} = req.body 
  if(!username || !password  ){
     return res.status(422).json({error:"please add all the fields"})
  }
  User.findOne({username : username})
  .then((savedUser)=>{
      if(savedUser){
        return res.status(422).json({error:"user already exists with that username. Please try different username"})
      }
      bcrypt.hash(password,12)
      .then(hashedpassword=>{
            const user = new User({
               username, 
               password   : hashedpassword
            })
    
            user.save()
            .then(user=>{
                
                res.json({message:"saved successfully"})
            })
            .catch(err=>{
                console.log(err)
            })
      })
     
  })
  .catch(err=>{
    console.log(err)
  })
})

// User login route
router.post('/login',(req,res)=>{
  console.log(req.body, "got the login request")
  const {username,password} = req.body
  if(!username || !password){
     return res.status(422).json({error:"please add username or password"})
  }
  User.findOne({username:username})
  .then(savedUser=>{
      if(!savedUser){
         return res.status(422).json({error:"Invalid username or password"})
      }
      bcrypt.compare(password,savedUser.password)
      .then(doMatch=>{
          if(doMatch){
/*             return res.json({message:"successfully signed in"})
 */          const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
             const {_id,username,password} = savedUser
            return res.json({token,user:{_id,username}}) 
          }
          else{
              return res.status(422).json({error:"Invalid  password"})
          }
      })
      .catch(err=>{
          console.log(err)
      })
  })
})


module.exports = router;
