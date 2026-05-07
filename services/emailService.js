const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendStatusEmail(email, status) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Application Status Update",
        text: `Your application status is now ${status}`
    };
    await transporter.sendMail(mailOptions);
}

module.exports = sendStatusEmail;