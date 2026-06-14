const express = require("express");
const router = express.Router();
const {notificationForUser,markNotificationAsRead}=require("../controllers/notificationController")

router.get("/:userId",notificationForUser)
router.patch("/:notificationId/read", markNotificationAsRead)

module.exports = router;