const express = require('express')
const router = express.Router();
const { registerUser, loginUser, profilePage } = require('../controllers/authController')
const { authMiddleware } = require('../middlewares/authMiddleware')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile', authMiddleware, profilePage)


module.exports = router