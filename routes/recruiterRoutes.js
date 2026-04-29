const express = require('express')
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware')
const { recruiterOnly } = require('../middlewares/recruiterOnly')
const { JobPostCreation, updatePost, deletePost , updatePostGETpage } = require('../controllers/recruiterController')
const { getAllCandidatesAppliedForJob, changeApplicationStatus, getAllJobs, getPageForJobCreation } = require('../controllers/recruiterController')

router.post('/create', authMiddleware, recruiterOnly, JobPostCreation);
router.get('/create', authMiddleware, recruiterOnly, getPageForJobCreation);

router.get('/myjobs', authMiddleware, recruiterOnly, getAllJobs);
router.get("/:id/applications", authMiddleware, recruiterOnly, getAllCandidatesAppliedForJob);
router.post("/:id/status", authMiddleware, recruiterOnly, changeApplicationStatus);

router.get('/:id/update', authMiddleware, recruiterOnly, updatePostGETpage);
router.put('/:id/update', authMiddleware, recruiterOnly, updatePost);
router.delete('/:id/delete', authMiddleware, recruiterOnly, deletePost);


module.exports = router;