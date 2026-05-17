const express = require('express')
const router = express.Router();
const ai = require("../services/aiServices")
const { aiJobDesciption, GenerateMatchResume, aiPreparation, aiPreparationPostResponse, aiMockInterview,aiMockInterviewPostReq,aiMockInterviewPostEvaluateAnswer } = require("../controllers/aiControllers")
const { authMiddleware } = require('../middlewares/authMiddleware')
const { recruiterOnly } = require('../middlewares/recruiterOnly')

router.post("/generate-ai-description", authMiddleware, recruiterOnly, aiJobDesciption)
router.post("/check-match/:id", authMiddleware, recruiterOnly, GenerateMatchResume)
router.get("/preparation", authMiddleware, aiPreparation)
router.post("/preparation", authMiddleware, aiPreparationPostResponse)
router.get("/mockInterview", authMiddleware, aiMockInterview)
router.post("/mockInterview",authMiddleware,aiMockInterviewPostReq)
router.post("/evaluateAnswer",authMiddleware,aiMockInterviewPostEvaluateAnswer)

module.exports = router;