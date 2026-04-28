const express = require('express')
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware')
const { getAlljob, showJobPost } = require('../controllers/jobController')

router.get('/alljobs', authMiddleware, getAlljob)
router.get('/:id', authMiddleware, showJobPost)

module.exports = router;