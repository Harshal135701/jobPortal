const express = require('express')
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware')
const { getAlljob, showJobPost, bookMarkedJobPost, getSavedJobs } = require('../controllers/jobController')

router.get('/alljobs', authMiddleware, getAlljob)
router.get('/saved', authMiddleware, getSavedJobs)
router.get('/:id', authMiddleware, showJobPost)
router.post("/bookmark/:id", authMiddleware, bookMarkedJobPost)
module.exports = router;