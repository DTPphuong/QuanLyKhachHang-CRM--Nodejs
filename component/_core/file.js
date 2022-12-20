'use strict';
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const moment = require("moment");

// cau hinh khu vuc luu tru file, thay doi lai ten file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (req.destination) {
            cb(null, req.destination);
        } else {
            const _d = 'public/upload/' + moment().year() + '/' + (moment().month() + 1) + '/' + moment().date();
            if (!fs.existsSync(_d)){
                fs.mkdirSync(_d, { recursive: true });
            }
            cb(null, _d);
        }
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, 'file-' + Date.now() + ext);
    }
});

// cau hinh dung luong file, so luong file
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB upload limit
        files: 5 // 5 file
    },
    fileFilter: (req, file, cb) => {
        const accepted_extensions = req.ext;
        // if the file extension is in our accepted list
        if (accepted_extensions.some(ext => file.originalname.endsWith("." + ext))) {
            return cb(null, true);
        } else {
            return cb(true, {data: 'Only ' + accepted_extensions.join(", ") + ' files are allowed!'});
        }
    }
}).fields([
    {name: 'files'}, // khai bao name cua field input upload
    {name: 'image1'}, // khai bao name cua field input upload
    {name: 'image2'}, // khai bao name cua field input upload
    {name: 'image3'}, // khai bao name cua field input upload
]);

module.exports = {
    upload
};