const express = require("express");
const router = express.Router();
const {notificationForUser}=require("../controllers/notificationController")

router.get("/:userId",notificationForUser)

module.exports = router;