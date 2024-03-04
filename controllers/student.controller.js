let studentModel = require('../models/student.model')
let jwt = require('jsonwebtoken')

const displayWelcome = (req, res) => {
    res.send('welcome user');
}

const registerUser = (req, res) => {
    console.log(req.body);
    let form = new studentModel(req.body);
    form.save()
    .then(result => {
        console.log('saved successfully');
        res.send({status:true, message: "signup successful"})
    })
    .catch(err => {
        console.log("Couldn't save");
        console.log(err);
        res.send({status:false, message: "signup not successful"})
    })
    
}

const signinuser = (req, res) => {
    console.log(req.body);

    let {email, password} = req.body
    studentModel.findOne({email:email}).then((user)=> {
        console.log(user);

        if(!user) {
            res.send({status: false, message: "user not found"})
        } else {
            user.validatePassword(password, (err, same)=> {
                if(!same) {
                    res.send({status: false, message: "Wrong credentials"} )
                } else {
                    // console.log('User found');
                   let token =  jwt.sign({email}, "secret", {expiresIn:"6s"})
                    console.log(token);
                    res.send({status: true, message: "Hurray user found", token})
                }
            })
        }
    }).catch((err)=> {
        console.log(err);
    })
}


const getDashboard = (req, res) => {
   let token = (req.headers.authorization.split(" ")[1]);
   jwt.verify(token, "secret", (err, result)=> {
        if(err) {
            console.log(err);
            res.send({status:false, message: ""})
        } else {
            studentModel.findOne({email:result.email}).then((user)=> {
                console.log(user);
                res.send({status:true, message:"welcome", result, user})
            console.log(result);
            })
            
        }
   })

}



module.exports = {displayWelcome, registerUser, signinuser, getDashboard}