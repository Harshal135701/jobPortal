const express = require('express')
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware')
const { recruiterOnly } = require('../middlewares/recruiterOnly')
const { ApplyForJob, getAllAppliedJobs} = require('../controllers/applicationController')

router.post('/apply/:id/', authMiddleware, ApplyForJob)
router.get("/my", authMiddleware, getAllAppliedJobs)

module.exports = router;