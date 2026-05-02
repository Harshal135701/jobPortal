const jobSchema = require('../models/job')
const userSchema = require('../models/user')

async function getAlljob(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const skip = (page - 1) * limit;

        const keyword = req.query.keyword || "";
        const category = req.query.category || "";
        const sort = req.query.sort || "";

        let sortOption = {};
        if (sort === 'latest') {
            sortOption = { createdAt: -1 };
        }
        else if (sort === 'salary_high') {
            sortOption = { salary: -1 };
        }
        else if (sort === 'salary_low') {
            sortOption = { salary: 1 };
        }

        const query = {
            $and: [
                {
                    $or: [
                        { title: { $regex: keyword, $options: "i" } },
                        { description: { $regex: keyword, $options: "i" } }
                    ]
                },
                // options used for case insensitiveness
                category ? { category: { $regex: category, $options: "i" } } : {}
            ]
        };

        const jobs = await jobSchema.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        const totalDocuments = await jobSchema.countDocuments(query);
        const totalPages = Math.max(1, Math.ceil(totalDocuments / limit));

        if (jobs.length === 0) {
            return res.status(200).render("alljobs", {
                jobs: [],
                message: "job not found",
                currentPage: page,
                totalPages,
                keyword,
                category,
                sort
            });
        }

        return res.status(200).render("alljobs", {
            jobs,
            count: jobs.length,
            totalPages,
            currentPage: page,
            keyword,
            category,
            sort
        });

    } catch (err) {
        return res.status(500).render("alljobs", {
            jobs: [],
            message: "Something went wrong while loading jobs"
        });
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