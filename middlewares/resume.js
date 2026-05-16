const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/resume')
    },
    filename: function (req, file, cb) {
        const uniqueName =
            Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
        cb(null,uniqueName)
    }
})

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        // pdf and docx file are now acceptable 
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF and DOCX files are allowed"), false);
    }
};
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    }
})

module.exports = upload.single("resumeUrl")