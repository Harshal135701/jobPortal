const express = require('express')
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware')
const { getAlljob, showJobPost, bookMarkedJobPost, getSavedJobs,RemoveBookmark } = require('../controllers/jobController')

router.get('/alljobs', authMiddleware, getAlljob)
router.get('/saved', authMiddleware, getSavedJobs)
router.get('/:id', authMiddleware, showJobPost)
router.post("/bookmark/:id", authMiddleware, bookMarkedJobPost)
router.post('/bookmark/:id/remove',authMiddleware,RemoveBookmark)
module.exports = router;