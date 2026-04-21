const express = require('express')
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware')
const { recruiterOnly } = require('../middlewares/recruiterOnly')
const { ApplyForJob, getAllAppliedJobs, getAllCandidatesAppliedForJob } = require('../controllers/applicationController')

router.post('/jobs/:id/applications', authMiddleware, ApplyForJob)
router.get("/applications/my", authMiddleware, getAllAppliedJobs)
router.get("/jobs/:id/applications", authMiddleware, recruiterOnly, getAllCandidatesAppliedForJob)

module.exports = router;