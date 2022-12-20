const express = require('express');
const router = express.Router();
const service = require('./service');
const permission = require('../_core/middlewares/permission');

// api route
router.post(
    '/api/create',
    [],
    service.postApiUserCreate,
);
router.get(
    '/api/list',
    [],
    service.getApiUserList,
);
// end api route


router.get(
    '/signup', [permission.noLogin],
    service.getSignup,
);
router.post(
    '/signup', [permission.noLogin],
    service.postSignup,
);
router.get(
    '/checkOTP', [permission.isActiveUserActon],
    service.getCheckOTP,
);
router.post(
    '/checkOTP', [permission.isActiveUserActon],
    service.postCheckOTP,
);

router.get(
    '/signin', [permission.noLogin],
    service.getSignin,
);

router.post(
    '/signin', [permission.noLogin],
    service.postSignin,
);

router.post(
    '/resend', [],
    service.postResend,
);

router.get(
    '/forgotpass', [permission.noLogin],
    service.getForgotPass
);

router.post(
    '/forgotpass', [permission.noLogin],
    service.postForgotPass
);

router.get(
    '/OTP-reset-pass', [permission.isActiveUserActon],
    service.getOTPResetPass,
);

router.post(
    '/OTP-reset-pass', [permission.isActiveUserActon],
    service.postOTPResetPass,
);

router.get(
    '/confirmpass', [permission.isActiveUserActon],
    service.getConfirmPass,
);

router.post(
    '/confirmpass', [permission.isActiveUserActon],
    service.postConfirmPass,
);

router.get(
    '/mess-success-change-pass', [permission.isActiveUserActon],
    service.getMessSuccess,
);

router.get(
    '/logout', [permission.mustLogin],
    service.getLogout
);
// //==========================Profile=================================

router.get(
    '/user_profile', [permission.mustLogin],
    service.getUserProfile
);

// Update Profile
router.post(
    '/user_profile', [permission.mustLogin],
    service.UpdateProfile
);
//update mật khẩu
router.post(
    '/password_profile', [permission.mustLogin],
    service.postUpProfile_Pass
);
// //===========================upload file============================================================
//thư viện
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/upload/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }

});
const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        return cb(new Error('Sai định dạng hình ảnh'), false);
    }
    cb(null, true);
};

let upload = multer({ storage: storage, fileFilter: imageFilter });

router.post(
    '/upload-profile-pic', upload.single('profile_pic'),
    service.handleUploadFile
);
module.exports = router;