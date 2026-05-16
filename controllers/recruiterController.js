const jobSchema = require('../models/job')
const userSchema = require('../models/user')
const applicationSchema = require('../models/application')
const sendStatusEmail = require("../services/emailService");
const job = require('../models/job');

async function JobPostCreation(req, res) {
    try {
        const { title, description, company, location, salary, jobType, experienceLevel, category } = req.body;
        const recruiterId = req.user._id;

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
            category,
            createdBy: recruiterId
        })
        console.log("JOB POST CREATED");

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
        const sortJobs = req.query.sortJobs;

        let sortOptions = {};

        if (sortJobs === "latest") {
            sortOptions = { createdAt: -1 };
        }

        else if (sortJobs === "oldest") {
            sortOptions = { createdAt: 1 };
        }
        else if (sortJobs === "highestpaying") {
            sortOptions = { salary: -1 };
        }
        else if (sortJobs === "lowestpaying") {
            sortOptions = { salary: 1 };
        }
        else if (sortJobs === "mostapplicants") {
            sortOptions = { totalApplications: -1 };
        }

        else if (sortJobs === "leastapplicants") {
            sortOptions = { totalApplications: 1 };
        }

        // const jobs = await jobSchema.find({ createdBy: userId });

        const pipeline = [
            {
                $match: {
                    createdBy: userId
                }
            },

            {
                $lookup: {
                    from: "applications",
                    localField: "_id",
                    foreignField: "job",
                    as: "applications"
                }
            },

            {
                $addFields: {
                    totalApplications: {
                        $size: "$applications"
                    }
                }
            }
        ];
        // we sortOptions is null no sorting
        if (Object.keys(sortOptions).length > 0) {
            pipeline.push({
                // above we stored which kind of sorting have to do 
                // store it in variable sortOptions 
                // and then do sorting here
                $sort: sortOptions
            });
        }

        const jobs = await jobSchema.aggregate(pipeline);

        if (jobs.length === 0) {
            return res.status(200).render("JobsCreatedByRecruiter", {
                jobs: [],
                sortJobs
            })
        }
        return res.status(200).render("JobsCreatedByRecruiter", {
            jobs,
            sortJobs
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

        const {
            title,
            description,
            company,
            location,
            salary,
            jobType,
            experienceLevel
        } = req.body;

        const updatedJob = await jobSchema.findByIdAndUpdate(
            jobId,
            {
                title,
                description,
                company,
                location,
                salary,
                jobType,
                experienceLevel
            },
            { new: true }
        );

        if (!updatedJob) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            updatedJob
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

async function updatePostGETpage(req, res) {
    try {
        const jobId = req.params.id;
        const jobPost = await jobSchema.findById(jobId)
        return res.status(200).render("update", {
            job: jobPost
        });
    }
    catch (err) {
        return res.status(500).render("update", {
            message: err.message
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

        const deletedPost = await jobSchema.findByIdAndDelete(
            jobId
        )
        const changeStatus = await applicationSchema.updateMany({ job: jobId }, { status: 'Closed' });
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
                applicants: []
            })
        }
        const applicants = await applicationSchema
            .find({ job: jobId })
            .select("applicant status matchPercentage")
            // Selct use to select only things we want to show on api
            .populate("applicant", "fullname email occupation experience ")
            .sort({matchPercentage:-1});

        if (applicants.length == 0) {
            return res.status(200).render("getAllCandidate", {
                applicants: [],
                message: "No applicants yet"
            })
        }
        return res.status(200).render("getAllCandidate", {
            applicants,
            job: jobId
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
        const applicantId = applicationIs.applicant;
        const applicant = await userSchema.findById(applicantId);
        if (!applicant) {
            return res.status(404).json({
                success: false,
                message: "Applicant not found"
            });
        }

        applicationIs.status = status;
        await applicationIs.save();

        if (status === "shortlisted" || status === "accepted") {
            await sendStatusEmail(applicant.email, status);
        }

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

async function loggedInRec(req, res) {
    try {
        const userId = req.user._id;
        const jobs = await jobSchema.aggregate([
            {
                $match: { createdBy: userId }
            },
            {
                $lookup: {
                    from: 'applications',
                    localField: "_id",
                    foreignField: "job",
                    as: "applications"
                }
            },
            {
                $addFields: {
                    applicationCount: { $size: "$applications" }
                }
            }
        ]);

        const totalPendingJobs = jobs.reduce((count, job) => {
            return count + job.applications.filter(app => app.status === "pending").length;
        }, 0)

        const totalShortlistedJobs = jobs.reduce((count, job) => {
            return count + job.applications.filter(app => app.status == "shortlisted").length;
        }, 0)

        const totalAcceptedJobs = jobs.reduce((count, job) => {
            return count + job.applications.filter(app => app.status == "accepted").length;
        }, 0)

        const totalRejectedJobs = jobs.reduce((count, job) => {
            return count + job.applications.filter(app => app.status == "rejected").length;
        }, 0)

        // Here the jobs is array which contains the job and its total number of applicants 
        // To add the all applicants from the jobs we used reduce 
        // eg . backend -> 3 , frontend -> 5 , cloud -> 4
        // sum -> 12 
        const totalNoofApplications = jobs.reduce((sum, job) => sum + job.applicationCount, 0);
        // instead of reduce we can also use 
        // let sum = 0;
        // for(let job of jobs){
        //    sum += job.applicationCount;
        // }

        return res.status(200).render("recruiterHome", {
            jobs,
            applicants: totalNoofApplications,
            pending: totalPendingJobs,
            accepted: totalAcceptedJobs,
            rejected: totalRejectedJobs,
            shortlisted: totalShortlistedJobs
        })
    }
    catch (err) {
        return res.status(500).render("recruiterHome", {
            jobs: [],
            applicants: 0,
            message: err.message
        })
    }
}

async function SeeCandidate(req, res) {
    try {
        const applicationId = req.params.applicationId;
        const applicantId = req.params.applicantId;

        if (!applicantId || !applicationId) {
            return res.status(404).render("SeeCandidate", {
                success: false,
                message: "The data not found"
            })
        }

        const IfApplied = await applicationSchema.findOne({ job: applicationId, applicant: applicantId })
        if (!IfApplied) {
            return res.status(401).render("SeeCandidate", {
                success: false,
                message: "Unathorized"
            })
        }
        const user = await userSchema.findById(applicantId);
        return res.status(200).render("SeeCandidate", {
            success: true,
            applicationId,
            // user,
            userResume: IfApplied.resumeUrl,
            applicant: IfApplied
        })
    }
    catch (err) {
        return res.status(500).render("SeeCandidate", {
            success: false,
            message: err.message
        })
    }
}



module.exports = {
    JobPostCreation, updatePost, deletePost,
    getAllCandidatesAppliedForJob,
    changeApplicationStatus,
    getAllJobs, getPageForJobCreation, updatePostGETpage, loggedInRec, SeeCandidate
}