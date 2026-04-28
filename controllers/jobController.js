const jobSchema = require('../models/job')
const userSchema = require('../models/user')

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



module.exports = { getAlljob, showJobPost }