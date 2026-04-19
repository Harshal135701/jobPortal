const jobSchema = require('../models/job')

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
            return res.status(200).json({
                message: "Data not found"
            })
        }
        return res.status(200).json({
            count: jobs.length,
            jobs
        })
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

async function showJobPost(req,res){
    try{
        const jobId=req.params.id;
        const jobPost=await jobSchema.findById(jobId);
        if(!jobPost){
            return res.status(404).json({
                message:"The job post not found"
            })
        }
        return res.status(200).json({
            message:"Job fetched successfully",
            jobPost
        })
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        })
    }
}



module.exports = { JobPostCreation, getAlljob ,showJobPost}