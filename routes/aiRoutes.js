const express = require('express')
const router = express.Router();
const ai = require("../services/aiServices")
const { aiJobDesciption } = require("../controllers/aiControllers")
const { authMiddleware } = require('../middlewares/authMiddleware')
const { recruiterOnly } = require('../middlewares/recruiterOnly')

router.post("/generate-ai-description", authMiddleware, recruiterOnly,aiJobDesciption)

module.exports = router;