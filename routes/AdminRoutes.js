const express = require("express");
const {AdminSignup, adminLogin, findAllUser, noUsers} = require("../controllers/adminController");
const { isAuthenticated } = require("../middleware/jwt");
const router = express.Router();

router.post("/signup", AdminSignup);
router.post("/login", adminLogin);
router.get("/finduser", isAuthenticated, findAllUser);
router.get("/allusers", isAuthenticated, noUsers);


module.exports = router;