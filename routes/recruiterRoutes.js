const express = require('express')
const router = express.Router();
const transporter = require("../services/emailService")
const { authMiddleware } = require('../middlewares/authMiddleware')
const { recruiterOnly } = require('../middlewares/recruiterOnly')
const { JobPostCreation, updatePost, deletePost, updatePostGETpage, ChatWithCandidate } = require('../controllers/recruiterController')
const { getAllCandidatesAppliedForJob, changeApplicationStatus, getAllJobs, getPageForJobCreation, loggedInRec, SeeCandidate, ChatWithRecruiter } = require('../controllers/recruiterController')

router.post('/create', authMiddleware, recruiterOnly, JobPostCreation);
router.get('/create', authMiddleware, recruiterOnly, getPageForJobCreation);

router.get('/myjobs', authMiddleware, recruiterOnly, getAllJobs);
router.get("/:id/applications", authMiddleware, recruiterOnly, getAllCandidatesAppliedForJob);
router.patch("/:id/status", authMiddleware, recruiterOnly, changeApplicationStatus);
router.get("/jobs/:applicationId/applicants/:applicantId", authMiddleware, recruiterOnly, SeeCandidate)

router.get('/:id/update', authMiddleware, recruiterOnly, updatePostGETpage);
router.put('/:id/update', authMiddleware, recruiterOnly, updatePost);
router.delete('/:id/delete', authMiddleware, recruiterOnly, deletePost);

router.get("/chat/:jobPostId/:recruiterId", authMiddleware, ChatWithRecruiter)
router.get(
    "/chat/candidate/:candidateId/:jobPostId",
    authMiddleware,
    ChatWithCandidate
)

router.get("/dashboard", authMiddleware, recruiterOnly, loggedInRec);

module.exports = router;