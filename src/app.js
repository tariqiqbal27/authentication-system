const express = require('express')
const express_session = require('express-session')
const mongoose = require('mongoose')
const userRouter = require('./router/userRoute')

const config = require('../config')
const PORT = process.env.PORT || 3000
const app = express()

//Connect to MongoDB
mongoose.connect(config.MongoURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(()=> console.log('Connected to Mongodb'))
.catch(err=>console.log(err))

app.use(express_session({
    name:"CookieName",
    secret: 'thisissecret',
    resave: false,
    saveUninitialized: false,
    cookie:{secure:false} //for production secure:true and https is required
}))   

//Setting the body parser
app.use(express.json())

//Using Routes
app.use(userRouter)

app.listen(PORT,()=>{
    console.log('Connected to the Server');
})