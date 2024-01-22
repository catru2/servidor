const deptController=require("../controllers/dept.controller")
const verifyToken = require("../middlewares/auth.middleware")
const express= require ("express")


const router=express.Router()

router.get("/dept",deptController.index)
router.post("/dept",verifyToken,deptController.createDept)
router.get("/nueva",verifyToken,deptController.getNuevosDept)

module.exports=router