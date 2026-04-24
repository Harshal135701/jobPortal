const express = require('express')
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware')
const { recruiterOnly } = require('../middlewares/recruiterOnly')
const { ApplyForJob, getAllAppliedJobs, getAllCandidatesAppliedForJob,changeApplicationStatus } = require('../controllers/applicationController')

router.post('/jobs/:id/applications', authMiddleware, ApplyForJob)
router.get("/applications/my", authMiddleware, getAllAppliedJobs)
router.get("/jobs/:id/applications", authMiddleware, recruiterOnly, getAllCandidatesAppliedForJob)
router.put("/application/:id/status",authMiddleware,recruiterOnly,changeApplicationStatus)

module.exports = router;