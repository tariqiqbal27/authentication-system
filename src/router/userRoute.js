const express = require('express')
const User = require('../models/userModel')

const router = new express.Router()

// SESSION CHECK - FOR LOGIN AND REGISTER
const loginCheck = (req,res,next) =>{
    if(req.session.userId) 
        return res.send({code:"AUTH_OK",msg: "User already authenticated"})
    next()
}

// CHECK USER SESSION
const sessionCheck = (req, res, next) => {
    if (req.session.userId) 
        next()
    else
        res.status(400).send({code:"AUTH_NOT_SUCCESS",msg:"User not Authenticated"})
}        

// Register for New User
router.post('/register',loginCheck ,async (request, response) => {
    const user = new User(request.body)
    try {
        await user.save();
        request.session.userId = user._id
        response.status(201).send({"code": "ACCOUNT_CREATED","msg": "User Created"})
    } catch (e) { response.status(400).send(e) }
})

// Login Router
router.post('/login' ,loginCheck,async (req, res) => {
    const { email, password } = req.body
    if (email && password) {
        try {
            const user = await User.Login(email,password)
            req.session.userId =  user._id
            res.status(201).send({id:req.session.userId})
        } catch (error) {
            res.send({code:"LOGIN_INVALID",msg:"Email & password wrong"})
        }
    }
})

// Get current User data
router.get('/user', sessionCheck ,async (req, res) => {
    const userId = req.session.userId
    try{
        const user = await User.findById(userId)
         res.send(user)
    }catch(e) {
        res.status(400).send(e)
    }
})

// Logout of Current Session
router.post('/user/logout', sessionCheck,async (req,res) => {
    req.session.destroy(err =>{
        if(err)
            return new Error(err)
    })
    res.clearCookie('CookieName')
    res.send({code:"AUTH_LOGOUT_SUCCESS",msg: "Logout Successfully"})
})

// Get Current User ID
router.get('/user/getID',sessionCheck,async(req,res)=>{
    res.send(req.session.userId)
})

//Change Password (old_password,new_password)
router.patch('/user/change_password',sessionCheck,async(req,res)=>{
    const {old_password, new_password} = req.body
    const userID = req.session.userId
    const result = await User.changePassword(userID,old_password,new_password)
    res.send(result)
})

// Deletes the User
router.delete('/user/delete',sessionCheck,async(req,res)=>{
    const id = req.session.userId
    try{
        await User.findByIdAndRemove(id)
        req.session.destroy(err =>{
            if(err)
                return new Error(err)
        })
        res.clearCookie('Random')
        res.status(201).send({code:"DELETED_OK",msg:"Account Deleted"})
    }catch(e) {
        res.status(404).send("Error something went wring")
    }
})

module.exports = router