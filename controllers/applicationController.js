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
        const jobIs = await jobSchema.findById(jobId)
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

async function getAllAppliedJobs(req, res) {
    try {
        const { userId } = req.user;
        const applications = await applicationSchema.find({ applicant: userId }).select("-_id status").populate("job", "-_id title  company location salary");
        // In application model we store the reference of job and applicant so when we try to fetch the application data it will fetch the ids instead of actaul content so to avoid it we used the populate() 
        return res.status(200).render("myapplication", {
            applications
        })
    }
    catch (err) {
        return res.status(500).render("myapplication", {
            applications: [],
            message: err.message
        })
    }
}

async function getAllCandidatesAppliedForJob(req, res) {
    try {
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                success: false
            })
        }
        const applicants = await applicationSchema
            .find({ job: jobId })
            .select("applicant status -_id")
            // Selct use to select only things we want to show on api
            .populate("applicant", "fullname email occupation -_id")
        if (applicants.length == 0) {
            return res.status(200).json({
                success: true,
                applicants: [],
                message: "No applicants yet"
            })
        }
        return res.status(200).json({
            success: true,
            applicants
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
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
    ApplyForJob,
    getAllAppliedJobs,
    getAllCandidatesAppliedForJob,
    changeApplicationStatus
}