const express = require('express')
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware')
const { recruiterOnly } = require('../middlewares/recruiterOnly')
const { ApplyForJob, getAllAppliedJobs,WithdrawalOfApplication} = require('../controllers/applicationController')

router.post('/apply/:id/', authMiddleware, ApplyForJob)
router.get("/my", authMiddleware, getAllAppliedJobs)
router.delete("/delete/:id",authMiddleware,WithdrawalOfApplication);

module.exports = router;