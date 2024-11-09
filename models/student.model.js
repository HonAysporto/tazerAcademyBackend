const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let studentSchema = mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    result: { type: String, default: '' },  // Default to empty string
    matricNo: { type: String, default: '' }, // Default to empty string
    department: { type: String, default: '' }, // Default to empty string
    currentLevel: { type: String, default: '' } // Default to empty string
    
});

let saltRound = 10;

// Pre-save hook to hash the password
studentSchema.pre('save', function(next) {
    bcrypt.hash(this.password, saltRound, (err, hashedPassword) => {
        if (err) {
            console.log("Password couldn't hash");
            console.log(err);
        } else {
            this.password = hashedPassword;
            next();
        }
    });
});

// Method to validate password
studentSchema.methods.validatePassword = function(password, callback) {
    bcrypt.compare(password, this.password, (err, same) => {
        if (!err) {
            callback(err, same);
        } else {
            next();
        }
    });
};

let studentModel = mongoose.model("student", studentSchema);

module.exports = studentModel;
