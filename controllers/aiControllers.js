const applicationSchema = require('../models/application')
const jobSchema = require('../models/job')
const userSchema = require('../models/user');
const ai = require("../services/aiServices")
const fs = require("fs");
const pdfParse = require("pdf-parse");
const path = require("path");

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

async function GenerateMatchResume(req, res) {
    try {
        const applicationId = req.params.id;
        // console.log(applicationId);
        const application = await applicationSchema.findById(applicationId).populate("applicant").populate("job");
        // console.log(typeof applicationId);

        if (!application) {
            return res.status(404).json({
                error: "Application not found"
            });
        }
        console.log(__dirname)
        // resume path
        const resumePath = path.join(
            __dirname,
            "..",
            "public",
            application.resumeUrl
        )

        // read pdf buffer
        const dataBuffer = fs.readFileSync(resumePath);
   
        // extract text from pdf
        const pdfData = await pdfParse(dataBuffer);
   

        const resumeText = pdfData.text.slice(0, 500);

        if (resumeText.trim().length < 50) {
            return res.status(400).json({
                success: false,
                error: "Unable to analyze resume. Please upload a text-based PDF resume."
            });
        }

        const prompt = `
            Analyze this resume against the job description.

            Candidate:
            Name: ${application.applicant.fullname}
            Experience: ${application.applicant.experience}
            Occupation: ${application.applicant.occupation}

            Resume:
            ${resumeText}

            Job Description:
            ${application.job.description}

            Give response ONLY in this exact format:

            Match Percentage: XX%

            Strengths:
            - point 1
            - point 2

            Weakness:
            - point 1
            - point 2

            Keep response very short and professional.
            `;



        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const matchResult =
            response.candidates[0].content.parts[0].text;


        return res.status(200).json({
            success: true,
            user: application.applicant,

            applicant: application,

            applicationId: application._id,

            userResume: application.applicant.resumeUrl,

            match: matchResult,

            error: null
        });

    }
    catch (err) {
        // console.log(err);
        return res.status(500).json({
            // error: err.message,
            err:"Something went wrong",
            match: null
        });
    }
}

module.exports = { aiJobDesciption, GenerateMatchResume }