const express = require("express");
const router = express.Router();

const {userDetails} = require("../controllers/userController");


router.post("/signup", userDetails);

module.exports = router;
