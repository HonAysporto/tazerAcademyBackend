let studentModel = require('../models/student.model')
let jwt = require('jsonwebtoken')

const displayWelcome = (req, res) => {
    res.send('welcome user');
}

const registerUser = (req, res) => {
    console.log(req.body);

    // Extract fields from the request body
    const { firstname, lastname, email, password } = req.body;

    // Create a new student document with empty result and matricNo
    let form = new studentModel({
        firstname,
        lastname,
        email,
        password,  // The password will be hashed before saving
        result: '',    // Empty string as the default value
        matricNo: '',
        currentLevel: '',
        department: ''  // Empty string as the default value
    });

    form.save()
        .then(result => {
            console.log('Saved successfully');
            res.send({ status: true, message: "Signup successful" });
        })
        .catch(err => {
            console.log("Couldn't save");
            console.log(err);
            res.send({ status: false, message: "Signup not successful" });
        });
};


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
                    res.send({status: false, message: "Wrong credentials"})
                } else {
                    // console.log('User found');
                   let token =  jwt.sign({email}, "secret", {expiresIn:"60m"})
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