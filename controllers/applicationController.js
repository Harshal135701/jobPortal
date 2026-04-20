const applicationSchema = require('../models/application')
const jobSchema = require('../models/job')
const userSchema = require('../models/user')

async function ApplyForJob(req, res) {
    try {
        const jobId = req.params.id;
        const applicantId = req.user.userId;
        if (!jobId || !applicantId) {
            return res.status(400).json({
                message: "The error occurs while fetching details"
            })
        }
        const jobIs = await jobSchema.findById(jobId);
        if (!jobIs) {
            return res.status(404).json({ message: "Job not found", success: false });
        }
        const applicantExist = await applicationSchema.findOne({
            applicant: applicantId,
            job: jobId
        })

        if (applicantExist) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            })
        }
        await applicationSchema.create({
            job: jobId,
            applicant: applicantId,
        })

        return res.status(201).json({
            message: "Application submitted successfully",
            success: true
        })
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

module.exports={
    ApplyForJob,
}