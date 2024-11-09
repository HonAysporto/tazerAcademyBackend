const mongoose = require('mongoose');
const bcrppt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    firstname: { type: String, required: true },   // fixed typo
    lastname: { type: String, required: true },    // fixed typo
    email: { type: String, required: true, unique: true }, // fixed typo
    password: { type: String, required: true },    // fixed typo
    isAdmin: { type: Boolean, default: true }
});


let saltRound = 10



adminSchema.pre('save', function(next) {
    console.log(this.password);
    bcrppt.hash(this.password, saltRound, (err, hashedPassword)=> {
        console.log(hashedPassword);
        if (err) {
            console.log("Password couldn't hashed");
            console.log(err);
        }  else {
            this.password = hashedPassword
            next()
        }
    })
})



adminSchema.methods.validatePassword = function(password, callback) {
    bcrppt.compare(password, this.password, (err, same) => {
        if(!err) {
            callback(err, same)
        } else {
            next()
        }
    })
}

const adminModel = mongoose.model('Admin', adminSchema);  

module.exports = adminModel; 