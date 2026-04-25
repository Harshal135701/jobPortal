const express = require('express')
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware')
const { recruiterOnly } = require('../middlewares/recruiterOnly')
const { JobPostCreation, getAlljob, showJobPost, updatePost, deletePost } = require('../controllers/jobController')
const jobSchema = require('../models/job')

router.post('/create', authMiddleware, recruiterOnly, JobPostCreation);
router.get('/alljobs', authMiddleware, getAlljob)
router.get('/:id', authMiddleware, showJobPost)
router.put('/:id', authMiddleware, recruiterOnly, updatePost)
router.delete('/:id', authMiddleware, recruiterOnly, deletePost)

module.exports = router;