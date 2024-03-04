//List of imports

const express = require('express')
const router = express.Router()
const {registerUser, displayWelcome, signinuser, getDashboard} =  require("../controllers/student.controller")
const cors = require('cors')

//routes
router.post("/signup", registerUser)

router.post('/signin', signinuser)
router.get("/dashboard", getDashboard)



module.exports = router