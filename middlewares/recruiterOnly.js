
async function recruiterOnly(req, res, next) {
    try {
        const userRole = req.user.role;
        if (userRole !== "recruiter") {
            return res.status(403).json({
                message: "Not have permission "
            })
        }
        next()
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

module.exports = { recruiterOnly }