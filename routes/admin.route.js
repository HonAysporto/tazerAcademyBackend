const express = require('express')
const router = express.Router()
const {registerAdmin, signinAdmin,  adminDashboard, deleteStudent, editStudent} =  require("../controllers/admin.controller")

router.post("/signup", registerAdmin)
router.post("/signin", signinAdmin)
router.get("/admindashboard", adminDashboard)
router.post('/delete', deleteStudent)
router.put('/edit', editStudent)





module.exports = router