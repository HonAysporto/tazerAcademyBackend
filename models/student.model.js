const mongoose = require('mongoose');
const bcrppt = require('bcryptjs');


let studentSchema = mongoose.Schema({
    firstname : {type:String, requrired: true},
    lastname : {type:String, requrired: true},
    email : {type:String, requrired: true, unique: true},
    password : {type:String, requrired: true},
})

let saltRound = 10


studentSchema.pre('save', function(next) {
    console.log(this.password);
    bcrppt.hash(this.password, saltRound, (err, hashedPassword)=> {
        console.log(hashedPassword);
        if (err) {
            console.log("Password couldn't hass");
            console.log(err);
        }  else {
            this.password = hashedPassword
            next()
        }
    })
})


studentSchema.methods.validatePassword = function(password, callback) {
    bcrppt.compare(password, this.password, (err, same) => {
        if(!err) {
            callback(err, same)
        } else {
            next()
        }
    })
}


let studentModel = mongoose.model("student", studentSchema)


module.exports = studentModel;