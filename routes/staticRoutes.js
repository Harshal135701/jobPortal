const express = require('express')
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware')

router.get('/profile', authMiddleware, (req, res) => {
    return res.status(200).json({
        message: "Protected route accessed",
        user: req.user
    })
})

module.exports = router;