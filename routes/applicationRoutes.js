const express = require('express')
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware')
const { recruiterOnly } = require('../middlewares/recruiterOnly')
const resumeUrl = require('../middlewares/resume')
const { ApplyForJobGetRoute, getAllAppliedJobs, WithdrawalOfApplication, applyForJobPostRoute } = require('../controllers/applicationController')

router.get('/apply/:id/', authMiddleware, ApplyForJobGetRoute)
router.post('/apply/:id/', authMiddleware, resumeUrl, applyForJobPostRoute)
router.get("/my", authMiddleware, getAllAppliedJobs)
router.delete("/delete/:id", authMiddleware, WithdrawalOfApplication);

module.exports = router;