const express = require('express')
const router = express.Router();

const ai = require("../services/aiServices")
const { authMiddleware } = require('../middlewares/authMiddleware')
const { recruiterOnly } = require('../middlewares/recruiterOnly')
const { aiLimiter } = require("../middlewares/aiRateLimiter")

const { aiJobDesciption, GenerateMatchResume, aiPreparation, aiPreparationPostResponse, aiMockInterview, aiMockInterviewPostReq, aiMockInterviewPostEvaluateAnswer } = require("../controllers/aiControllers")

router.post("/generate-ai-description", authMiddleware, recruiterOnly,aiLimiter, aiJobDesciption)
router.post("/check-match/:id", authMiddleware, recruiterOnly,aiLimiter, GenerateMatchResume)
router.get("/preparation", authMiddleware, aiPreparation)
router.post("/preparation", authMiddleware,aiLimiter, aiPreparationPostResponse)
router.get("/mockInterview", authMiddleware, aiMockInterview)
router.post("/mockInterview", authMiddleware,aiLimiter, aiMockInterviewPostReq)
router.post("/evaluateAnswer", authMiddleware,aiLimiter, aiMockInterviewPostEvaluateAnswer)

module.exports = router;