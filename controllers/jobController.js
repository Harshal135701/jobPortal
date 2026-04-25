const jobSchema = require('../models/job')
const userSchema = require('../models/user')

async function JobPostCreation(req, res) {
    try {
        const { title, description, company, location, salary, jobType, experienceLevel } = req.body;
        const recruiterId = req.user.userId;

        if (!title || !description || !company || !location || !salary || !jobType || experienceLevel == undefined) {
            return res.status(400).json({
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

        return res.status(201).json({
            message: "Job created successfully",
        })
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

async function getAlljob(req, res) {
    try {
        const jobs = await jobSchema.find({});
        if (jobs.length === 0) {
            return res.status(200).render("alljobs", {
                jobs: [],
                message: "job not found"
            })
        }

        return res.status(200).render("alljobs", {
            jobs,
            count: jobs.length,
        })
    }
    catch (err) {
        return res.status(500).render("alljobs", {
            jobs: [],
            message: "Something went wrong while loading jobs"
        })
    }
}

async function showJobPost(req, res) {
    try {
        const jobId = req.params.id;
        const jobPost = await jobSchema.findById(jobId);
        if (!jobPost) {
           return res.redirect('/jobs/alljobs')
        }
        return res.status(200).render("jobdetails", {
            jobpost: jobPost
        })
    }
    catch (err) {
         return res.redirect('/jobs/alljobs')
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


module.exports = { JobPostCreation, getAlljob, showJobPost, updatePost, deletePost }