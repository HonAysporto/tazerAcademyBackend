let studentModel = require('../models/student.model')
let adminModel = require('../models/admin.model');
require('dotenv').config();
const jwt = require('jsonwebtoken');


const registerAdmin = (req, res) => {
    const { firstname, lastname, email, password, adminCode } = req.body;

    

    if ((adminCode) !== "9625") {
        return res.status(403).json({ message: 'Unauthorized access' });
    }
    let form = new adminModel(req.body);
    form.save()
    .then(admin => res.status(201).json({ message: 'Admin created successfully', admin }))
    .catch(err => res.status(500).json({ message: 'Error saving admin', error: err.message }));
}

const signinAdmin = (req, res) => {
    const {email, password} = req.body;

   adminModel.findOne({ email })
  .then(admin => {
    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' });
    }

    // Validate password
    admin.validatePassword(password, (err, same) => {
      if (err) {
        return res.status(500).json({ message: 'Error validating password' });
      }

      if (!same) {
        return res.status(400).json({ status: false, message: 'Wrong credentials' });
      } 

      // If password matches, generate the JWT token
      const token = jwt.sign({ email: admin.email, id: admin._id }, process.env.ADMIN_SECRET, { expiresIn: '1h' });
      return res.status(200).json({ token, admin });
    });
  })
  .catch(err => {
    console.error('Error during authentication:', err);
    res.status(500).json({ message: 'Server error during authentication' });
  });


}

const adminDashboard = (req, res) => {
    let token = (req.headers.authorization.split(" ")[1]);
    jwt.verify(token, process.env.ADMIN_SECRET, (err, result) => {
        if (err) {
            console.log(err);
            res.send({status:false, message: ""})
        } else {
          Promise.all([
            studentModel.countDocuments({}),   // Fetch total students count
            adminModel.findOne({email:result.email}),  
            // Fetch admin details based on token
            studentModel.find()
        ])
    .then(([totalStudents, admindetails, allStudents]) => {
        console.log(allStudents);
        
        res.send({ status:true, total: totalStudents, admin:admindetails, students:allStudents});
    })
    .catch((err)=> {
        res.status(500).json({ error: 'Error fetching student count' });
    })
        }
    })
    
}

const deleteStudent = (req, res) => {
  const { studentId } = req.body;  // Get the studentId from the request body
  
  if (!studentId) {
    return res.status(400).json({ message: 'Student ID is required' });
  }

  // Use the `studentModel` to find and delete the student
  studentModel.findByIdAndDelete(studentId)
    .then(deletedStudent => {
      if (!deletedStudent) {
        return res.status(404).json({ message: 'Student not found' });
      }
      // If deletion is successful, return a success message
      return res.status(200).json({ message: 'Student deleted successfully', deletedStudent });
    })
    .catch(err => {
      console.error('Error deleting student:', err);
      return res.status(500).json({ message: 'Server error while deleting student', error: err.message });
    });
};


const editStudent = (req, res) => {
  const { studentId, firstname, lastname, email, result, matricNo, currentLevel, department } = req.body;
  
  // Log the request body for debugging
  console.log(req.body);

  // Check if studentId is provided
  if (!studentId) {
    return res.status(400).json({ message: 'Student ID is required' });
  }

  // Prepare the fields to update. Only include fields that are present in the request
  const updateFields = {};
  
  if (firstname) updateFields.firstname = firstname;
  if (lastname) updateFields.lastname = lastname;
  if (email) updateFields.email = email;
  if (result !== undefined) updateFields.result = result;  // `undefined` is explicitly checked to allow empty string ''
  if (matricNo !== undefined) updateFields.matricNo = matricNo;
  if (currentLevel !== undefined) updateFields.currentLevel = currentLevel;
  if (department !== undefined) updateFields.department = department;

  // Use findByIdAndUpdate to find the student and update their details
  studentModel.findByIdAndUpdate(
    studentId,  // The student to update
    updateFields, // Only update the fields that are passed in the request
    { new: true } // Return the updated document
  )
  .then(updatedStudent => {
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student updated successfully', updatedStudent });
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({ message: 'Error updating student', error: err.message });
  });
};




module.exports = {registerAdmin, signinAdmin, adminDashboard, deleteStudent, editStudent}