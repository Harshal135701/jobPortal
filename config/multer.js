const multer = require("multer");
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

// Local disk storage - still used for resumes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/resume");
    },

    filename: function (req, file, cb) {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// Cloudinary storage - used for profile pictures (candidate & recruiter)
// Uploads the image directly to Cloudinary and returns a permanent
// https://res.cloudinary.com/... URL in req.file.path

const profilePicStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "jobportal/profile_pics",
        allowed_formats: ["jpg", "jpeg", "png", "webp", "avif", "gif"],
        transformation: [{ width: 500, height: 500, crop: "limit" }]
    }
});

const uploadProfilePic = multer({
    storage: profilePicStorage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

module.exports = upload;
module.exports.uploadProfilePic = uploadProfilePic;
