const express = require('express')
const router = express.Router();
const { registerUser, loginUser, profilePage, registerPage, loginPage, logout } = require('../controllers/authController')
const { authMiddleware } = require('../middlewares/authMiddleware')
const profilePic  = require('../middlewares/profile')

router.post('/register', profilePic, registerUser)
router.get('/register', registerPage)
router.post('/login', loginUser)
router.get('/login', loginPage)
router.get('/home', authMiddleware, profilePage)
router.get('/', registerPage)
router.get("/logout", authMiddleware, logout)

module.exports = router