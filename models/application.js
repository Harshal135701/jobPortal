const mongoose = require("mongoose")

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "job",
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    status: {
        type: String,
        enum: ['pending','accepted','rejected','shortlisted','closed','withdrawn'],
        default: 'pending'
    }
}, { timestamps: true });
// Making the job and applicant as a index to avoid there combination in db again more than 1 
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('application', applicationSchema)