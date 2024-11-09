//List of import

const express = require('express')
const app = express()
let studentRouter = require('./routes/student.route')
let adminRouter = require('./routes/admin.route')
const cors = require('cors');
const {Mongoose,  default: mongoose} = require('mongoose')


//Middleware
app.use(cors())
app.use(express.urlencoded({extended:true, limit:"50mb"}))
app.use(express.json({limit:"50mb"}))
app.use("/student", studentRouter)
app.use('/admin', adminRouter)



// variable decleration


let URI = "mongodb+srv://Honourable:Password@cluster0.guyvfqs.mongodb.net/Tazeracademy?retryWrites=true&w=majority"

let PORT = 5000


mongoose.connect(URI).then(()=> {
    console.log('mongodb connected successfully');
}).catch((err)=> {
    console.log("mongodb couldn't connect");
    console.log(err);
})

app.listen(PORT, ()=> {
    console.log('App is listening at: ' + PORT);
})