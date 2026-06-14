const upload = require("../config/multer");

module.exports = upload.uploadProfilePic.single("profilepic");
