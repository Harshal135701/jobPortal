const express = require('express')
const router = express.Router();
const { registerUser, loginUser, profilePage, registerPage, loginPage } = require('../controllers/authController')
const { authMiddleware } = require('../middlewares/authMiddleware')

router.post('/register', registerUser)
router.get('/register', registerPage)
router.post('/login', loginUser)
router.get('/login', loginPage)
router.get('/profile', authMiddleware, profilePage)
router.get('/', registerPage)

module.exports = router