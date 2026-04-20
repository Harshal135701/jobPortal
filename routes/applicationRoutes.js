const express = require('express')
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware')
const { recruiterOnly } = require('../middlewares/recruiterOnly')
const { ApplyForJob } = require('../controllers/applicationController')

router.post('/jobs/:id/applications', authMiddleware, ApplyForJob)
router.get('/test-application', (req, res) => {
    res.send("application route working")
})

module.exports=router;