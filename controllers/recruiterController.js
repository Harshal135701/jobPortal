const jobSchema = require('../models/job')
const userSchema = require('../models/user')
const applicationSchema=require('../models/application')

async function JobPostCreation(req, res) {
    try {
        const { title, description, company, location, salary, jobType, experienceLevel } = req.body;
        const recruiterId = req.user._id;
        console.log(recruiterId)
        if (!title || !description || !company || !location || !salary || !jobType || experienceLevel == undefined) {

            return res.status(400).render("jobCreation", {
                message: "Fill the correct data"
            })
        }
        await jobSchema.create({
            title,
            description,
            company,
            location,
            salary,
            jobType,
            experienceLevel,
            createdBy: recruiterId
        })

        return res.redirect('/recruiter/myjobs')
    }
    catch (err) {
        return res.status(500).render("jobCreation", {
            message: err.message
        })
    }
}

async function getAllJobs(req, res) {
    try {
        const userId = req.user._id;
        const jobs = await jobSchema.find({ createdBy: userId });
        if (jobs.length === 0) {
            return res.status(200).render("JobsCreatedByRecruiter", {
                jobs: []
            })
        }
        return res.status(200).render("JobsCreatedByRecruiter", {
            jobs
        })
    }
    catch (err) {
        return res.status(500).render("JobsCreatedByRecruiter", {
            message: err.message,
            jobs: []
        })
    }
}

async function getPageForJobCreation(req, res) {
    try {
        return res.status(200).render("jobCreation");
    }
    catch (err) {
        return res.status(500).render("jobCreation", {
            message: err.message
        })
    }
}


async function updatePost(req, res) {
    try {
        const jobId = req.params.id;
        const jobIs = await jobSchema.findById(jobId);
        if (!jobIs) {
            return res.status(404).json({
                success: false,
                message: "job not found"
            })
        }
        const { userId } = req.user;
        const userIs = await userSchema.findById(userId);
        if (!userIs) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        if (userId !== jobIs.createdBy.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not have a permission to update post"
            })
        }
        const updatedPost = await jobSchema.findByIdAndUpdate(
            jobId,
            req.body,
            { new: true }
        );
        return res.status(200).json({
            success: true,
            message: "The post is updated",
            job: updatePost
        })
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            success: false
        })
    }
}

async function deletePost(req, res) {
    try {
        const jobId = req.params.id;
        const jobIs = await jobSchema.findById(jobId);
        if (!jobIs) {
            return res.status(404).json({
                success: false,
                message: "job not found"
            })
        }
        const { userId } = req.user;
        const userIs = await userSchema.findById(userId);
        if (!userIs) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        if (userId !== jobIs.createdBy.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not have a permission to delete post"
            })
        }
        const deletedPost = await jobSchema.findByIdAndDelete(
            jobId
        )
        return res.status(200).json({
            success: true,
            message: "The post is deleted",
            deletedJob: deletedPost
        })
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            success: false
        })
    }
}

async function getAllCandidatesAppliedForJob(req, res) {
    try {
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).render("getAllCandidate", {
                message: "Job post not found",
                applicants:[]
            })
        }
        const applicants = await applicationSchema
            .find({ job: jobId })
            .select("applicant status")
            // Selct use to select only things we want to show on api
            .populate("applicant", "fullname email occupation -_id")
        if (applicants.length == 0) {
            return res.status(200).render("getAllCandidate",{
                applicants:[],
                 message: "No applicants yet"
            })
        }
        return res.status(200).render("getAllCandidate",{
            applicants
        })
    }
    catch (err) {
         return res.status(500).render("getAllCandidate", {
            applicants: [],
            message: err.message
        });
    }
}

async function changeApplicationStatus(req, res) {
    try {
        const applicationId = req.params.id;
        if (!applicationId) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            })
        }
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required"
            });
        }
        const applicationIs = await applicationSchema.findById(applicationId);
        if (!applicationIs) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            })
        }
        applicationIs.status = status;
        await applicationIs.save();
        return res.status(200).json({
            success: true,
            message: "The status is updated"
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}



module.exports = {
    JobPostCreation, updatePost, deletePost,
    getAllCandidatesAppliedForJob,
    changeApplicationStatus,
    getAllJobs, getPageForJobCreation
}