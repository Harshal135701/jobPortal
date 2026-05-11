const applicationSchema = require('../models/application')
const jobSchema = require('../models/job')
const userSchema = require('../models/user');
const ai = require("../services/aiServices")

async function aiJobDesciption(req, res) {
    try {
        const { company, location, experienceLevel, jobType, salary, title } = req.body;

        if (
            !company ||
            !location ||
            !experienceLevel ||
            !jobType ||
            !salary ||
            !title
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const prompt = `Generate a job description using 
        Job title:${title} , Job experience level :${experienceLevel} , Job Type:${jobType} ,Job salary:${salary} only 6-7 lines but precise`

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        res.status(200).json({
            success: true,
            description: response.text,
        });

    }
    catch (err) {
        console.log(err),
            res.status(500).json({
                success: false,
                // description: response.text,
                error: err.message,
            });
    }
}

module.exports = { aiJobDesciption }