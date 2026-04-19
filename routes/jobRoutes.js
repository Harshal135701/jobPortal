const express = require('express')
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware')
const { recruiterOnly } = require('../middlewares/recruiterOnly')
const { JobPostCreation, getAlljob ,showJobPost} = require('../controllers/jobController')
const jobSchema = require('../models/job')

router.post('/create', authMiddleware, recruiterOnly, JobPostCreation);
router.get('/alljobs', authMiddleware, getAlljob)
router.get('/:id', authMiddleware, showJobPost)

module.exports = router;