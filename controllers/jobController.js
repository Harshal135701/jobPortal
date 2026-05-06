const jobSchema = require('../models/job')
const userSchema = require('../models/user')

async function getAlljob(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const skip = (page - 1) * limit;

        const keyword = req.query.keyword?.trim() || "";
        const category = req.query.category?.trim() || "";
        const sort = req.query.sort?.trim() || "";
        const location = req.query.location?.trim() || "";
        const jobType = req.query.jobType?.trim() || "";
        const salary = req.query.salary?.trim() || "";
        const experienceLevel = req.query.experienceLevel?.trim() || "";
        // ?. prevent the undefined document from trim
        // means it will only get used when const is not undefined

        let sortOption = {};
        if (sort === 'latest') {
            sortOption = { createdAt: -1 };
        }
        else if (sort === 'salary_high') {
            sortOption = { salary: -1 };
            // -1 means High to low
        }
        else if (sort === 'salary_low') {
            sortOption = { salary: 1 };
        }
        let query = {}

        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ];
        }

        if (experienceLevel) {
            query.experienceLevel = { $gte: Number(experienceLevel) };
        }

        if (category) {
            query.category = { $regex: category, $options: "i" }
        }

        if (location) {
            query.location = { $regex: location, $options: "i" }
        }

        if (jobType) {
            query.jobType = jobType
        }

        if (salary) {
            query.salary = { $gte: Number(salary) }
        }

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
                sort,
                location,
                jobType,
                experienceLevel,
                salary,
                bookmarkedJobs: []
            });
        }

        const user = await userSchema.findById(req.user._id);

        return res.status(200).render("alljobs", {
            jobs,
            count: jobs.length,
            totalPages,
            currentPage: page,
            keyword,
            category,
            sort,
            location,
            jobType,
            salary,
            experienceLevel,
            bookmarkedJobs: user.bookmark
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

async function bookMarkedJobPost(req, res) {
    try {
        const jobId = req.params.id;
        const userId = req.user._id;
        const user = await userSchema.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        // some is js method used to check the job id is present in bookmark or not 
        console.log(user.bookmark);
        const isBookMarked = user.bookmark.some(
            id => id && id.toString() === jobId
        );

        if (isBookMarked) {
            user.bookmark.pull(jobId);
        }
        else {
            // add to set only add once like a set
            user.bookmark.addToSet(jobId);
        }

        await user.save();

        return res.json({
            success: true,
            bookmarked: !isBookMarked
        });

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

async function getSavedJobs(req, res) {
    try {
        const user = await userSchema.findById(req.user._id).populate('bookmark')

        return res.render("getSavedJobs", {
            jobs: user.bookmark
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}

async function RemoveBookmark(req, res) {
    try {
        const jobId = req.params.id;
        const userId = req.user._id;

        await userSchema.findByIdAndUpdate(userId,{
            $pull:{bookmark:jobId}
        })

         res.json({ success: true });

    }
    catch (err) {
        res.json({ success: false });
    }
}


module.exports = { getAlljob, showJobPost, bookMarkedJobPost, getSavedJobs ,RemoveBookmark}