const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required: true,
        unique: true,
        lowercase: true
    },
    password:{
        type:String,
        required: true,
        minlength:8 //For Security Purpose
    }
},{
    timestamps: true //For CreatedAt
})

// Hashing the plain text password before saving
UserSchema.pre('save', async function(next){
    const saltRound = 8 //Salt round
    if(this.isModified('password')) 
        this.password = await bcrypt.hash(this.password,saltRound)
    next() 
})


// Login Handler
UserSchema.statics.Login = async function(email,password) {
    const user = await User.findOne({email})
    if(!user){
             throw ({msg:"User not found"})
    }
    const isMatched = await bcrypt.compare(password,user.password)
    if(!isMatched) {
        throw ({msg:'Incorrect Password'})
    }
        
    return user
}

// Change Password handler
UserSchema.statics.changePassword = async(id,password,new_password) =>{
    const saltRound = 8  //Salt Round
    const user = await User.findById(id)
    const isMatched = await bcrypt.compare(password,user.password) //Comparing old Password with Given Password
    const old_passMatched = await bcrypt.compare(new_password,user.password) // Comparing old Passwortd with the new Password
    if(!isMatched)
        return result = {code:"AUTH_PASSWORD_INCORRECT",msg:"Incorrect Account Password"}
    else if(old_passMatched)
        return result = {code:"AUTH_PASSWORD_SAME",msg:"New Password cannot be old password"}
    else {
        user.password = new_password // UserSchema.pre('save') will automatically hash the password before saving
        await user.save() 
        return result = {code:"AUTH_PASSWORD_CHANGE",msg: "Password changes Successfully"}
    }
}

// Prevent from getting sensitive data like Password Hashes
UserSchema.methods.toJSON = function() {
    const userObject = this.toObject()
    delete userObject.password
    return userObject
}

// Handle Error 
UserSchema.post('save',(error,doc,next)=>{
    const e = error
    // HANDLE UNIQUE ERROR
    if(e.name==='MongoError' && error.code===11000) {
        next({code:"EMAIL_ALREADY_EXIST", msg: 'Email Already Exist'})
    }
    // HANDLE MIN LENGHTH ERROR
    else if(e.errors.password.kind==='minlength') {
        next({code:"AUTH_MIN_PASSWORD",msg:"Password length must be greater than 7"})
    }
    //HANDLE EMAIL/PASSWORD REQUIRED ERROR
    else if(e.name==='ValidationError')
        next({code:"AUTH_BLANK_FIELD",msg:"Enter Email/Password"})
    else next(error)
})

mongoose.set('useFindAndModify', false)

const User = mongoose.model('User',UserSchema) //In mongodb it will store in collection users

module.exports = User