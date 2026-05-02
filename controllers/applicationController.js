const applicationSchema = require('../models/application')
const jobSchema = require('../models/job')
const userSchema = require('../models/user')

async function ApplyForJob(req, res) {
    try {
        const jobId = req.params.id;
        const applicantId = req.user._id;
        if (!jobId || !applicantId) {
            return res.status(400).json({
                success:false,
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
        const userId = req.user._id;
        const applications = await applicationSchema
            .find({ applicant: userId })
            .populate("job");
        // In application model we store the reference of job and applicant so when we try to fetch the application data it will fetch the ids instead of actaul content so to avoid it we used the populate() 
        // console.log("Applications Data:", applications);
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

async function WithdrawalOfApplication(req, res) {
    try {
        const userId = req.user._id;
        const applicationId = req.params.id;

        const applicationIs = await applicationSchema.findById(applicationId);

        if (!applicationIs) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            })
        }
        if (applicationIs.applicant.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unathorized"
            })
        }
        if (applicationIs.status.toLowerCase() !== "pending") {
            return res.status(403).json({
                success: false,
                message: "This application is already processed and cannot be withdrawn"
            })
        }
        applicationIs.status = "withdrawn";
        await applicationIs.save();
        return res.json({
            success: true,
            message: "Application withdrawn successfully"
        });
    }
    catch (err) {
    console.log("ERROR:", err);   // 🔥 ADD THIS
    return res.status(500).json({
        success:false,
        message: err.message      // 🔥 SHOW REAL ERROR
    })
}
}

module.exports = {
    ApplyForJob,
    getAllAppliedJobs, WithdrawalOfApplication

}