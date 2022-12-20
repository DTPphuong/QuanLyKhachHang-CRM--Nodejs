'use strict';
const constant = require('./../_core/constant');
const bcrypt = require('bcrypt');
const utils = require('./../_helper/utils');
const listData = require('./../list/database/data');
const listModel = require('./../list/database/model.list');
const userData = require('./database/data');
const userModel = require('./database/model.user');
const moment = require('moment');
const redis = require('redis');
const client = redis.createClient();
const dataHandle = require('./../_helper/dataHandle');


const getSignup = async(req, res) => {
    res.render('pages/auth/signup', {
        title: 'Sign Up',
        layout: 'partials/layout-withoutNav'
    });
};

const postSignup = async(req, res) => {
    try {
        //Tim kiem so sanh mobile tren he thong
        const user = await userData.findBy({
            mobile: utils.Trim(req.body.mobile),
        });
        // Neu trung thi thong bao cho user biet
        if (user) {
            //thông báo ra màn hình
            req.flash('error_messages', 'Số điện thoại đã được đăng ký!');
            res.redirect('back');
        } else {
            const data = {
                    full_name: utils.Trim(req.body.fullName),
                    email: utils.Trim(req.body.email),
                    mobile: utils.Trim(req.body.mobile),
                    password: await bcrypt.hash(req.body.password, 12), // Ma hoa password
                    api_key: utils.generateAPIkey(30), //Tao ramdom ma gom 30 ky tu
                }
                //push dữ liệu lên database 
            const user = await userData.userCreate(data);
            //push full_name trong db list(cohot)
            const dataList = {
                user_id: user.id,
                full_name: 'Khách hàng thuộc API',
                status: 'show',
            };
            const list_fullName = await listData.listCreate(dataList);

            // Tao OTP xac thuc tai khoan
            utils.OTP_comfirm_user(user.id);
            // luu session mobile, active_user
            req.session.active_user = user.id;
            req.session.mobile = user.mobile;
            //Chuyen sang trang xac thuc tai khoan
            res.redirect('/auth/checkOTP')
        }
    } catch (ex) {
        console.log(ex);
        res.render('pages/error/500');
    }
}

const getCheckOTP = async(req, res) => {
    //Hien thi Timeout tren trang OTP
    client.TTL('otp_' + req.session.active_user, async(err, reply) => {
        if (err) throw err;
        if (reply < 0) {
            reply = 'Mã OTP đã hết hạn'
        }
        res.render('pages/auth/OTP', {
            title: 'OTP',
            layout: 'partials/layout-withoutNav',
            reply,
            req,
        });
    });
};

const postCheckOTP = async(req, res) => {
    try {
        //lấy 6 số khách nhập
        const OTP1 = req.body.dight1;
        const OTP2 = req.body.dight2;
        const OTP3 = req.body.dight3;
        const OTP4 = req.body.dight4;
        const OTP5 = req.body.dight5;
        const OTP6 = req.body.dight6;
        const maOTP = OTP1 + OTP2 + OTP3 + OTP4 + OTP5 + OTP6;
        //chuyển mã OTP sang string
        const OTPinput = JSON.stringify(maOTP);
        //chuyển mã OTP trong redis sang string
        client.get('otp_' + req.session.active_user, async(err, reply) => {
            if (err) throw err;
            // chuyen redis thanh chuoi
            const OTPredis = JSON.stringify(reply);
            //so sanh OTPinput voi OTPredis
            if (OTPinput === OTPredis) {
                //tim kiem ID user
                const user = await userData.findBy({
                    id: req.session.active_user
                });
                //update status
                user.update({
                    status: 'active'
                });
                //cho vao trang index (lưu sesstion để đi thẳng vào trang dashboard)
                req.session.user = user.id;
                res.redirect('/dashboard');
                console.log('Dang ky admin thanh cong!');

            } else {
                //sai OTP thì back lại và thông báo
                req.flash('error_messages', 'Mã OTP không đúng');
                res.redirect('back');
                console.log('Ma OTP khong dung');
            }
        });
    } catch (ex) {
        console.log(ex);
        res.render('pages/error/500');
    }
};

const getSignin = async(req, res) => {
    res.render('pages/auth/signin', {
        title: 'Sign In',
        layout: 'partials/layout-withoutNav',
        req,
    });
};

const postSignin = async(req, res) => {
    try {
        //Tìm kiếm so sánh mobile
        const user = await userData.findBy({
            mobile: utils.Trim(req.body.mobile),
        });
        //Neu co mobile tren he thong
        if (user) {
            //so sánh pass của khách nhập với pass mã hóa
            const compare = await bcrypt.compare(utils.Trim(req.body.password), user.password);
            //nếu trùng password thì
            if (compare) {
                //Nếu status của tài khoản đang pending thì chuyển sang trang xác thực tài khoản
                if (user.status === 'pending') {
                    //lưu session
                    req.session.mobile = user.mobile;
                    req.session.active_user = user.id;
                    //tao ma OTP
                    utils.OTP_comfirm_user(user.id);
                    //Dua vao trang xac nhan OTP
                    res.redirect('/auth/checkOTP')
                //Nếu status của tài khoản đang Block thì thông báo tk bị khóa
                } else if (user.status === 'block') {
                    req.flash('error_messages', 'Tài khoản đã bị khóa!');
                    res.redirect('back');
                //Nếu status của tài khoản là active thì cho đăng nhập
                } else if (user.status === 'active') {
                    req.session.user = user.id;
                    res.redirect('/dashboard');
                    console.log('Đăng nhập thành công!')
                }
            //Nếu không trùng thì thông báo nhập không đúng
            } else {
                req.flash('error_messages', 'Số điện thoại hoặc mật khẩu không đúng.');
                res.redirect('back');
            }
        }
        //Nếu không có mobile nhập trên hệ thống
        else {
            req.flash('error_messages', 'Số điện thoại hoặc mật khẩu không đúng.');
            res.redirect('back');
        }
    } catch (ex) {
        console.log(ex);
        res.render('pages/error/500');
    }
};

const postResend = async(req, res) => {
    try {
        //Xuất mã OTP lại gán vào biến
        client.get('otp_' + req.session.active_user, (err, reply) => {
            if (err) throw err;
            const OTPrecall = reply;
            //Nếu OTP hết hạn thì tạo lại OTP mới
            if (OTPrecall === null) {
                //Tạo mã OTP mới
                utils.OTP_comfirm_user(req.session.active_user);
                req.flash('success_messages', 'Mã OTP mới đã được gửi!');
                res.redirect('back');
            //Nếu OTP chưa hết hạn thì thông báo sử dụng mã cũ
            } else {
                req.flash('error_messages', 'Mã OTP còn hiệu lực, Kiểm tra OTP gửi về điện thoại!');
                res.redirect('back');
                console.log('Ma van con:', OTPrecall);
            }
        });
    } catch (ex) {
        console.log(ex);
        res.render('pages/error/500');
    }
};

const getForgotPass = async(req, res) => {
    res.render('pages/auth/forgotpass', {
        title: 'ForgotPass',
        layout: 'partials/layout-withoutNav'
    });
};

const postForgotPass = async(req, res) => {
    try {
        //Tìm sdt xem có trên hệ thống không
        const user = await userData.findBy({
            mobile: utils.Trim(req.body.mobile),
        });
        //Nếu tìm thấy SDT có trên hệ thống thì
        if (user) {
            //luu session
            req.session.active_user = user.id;
            req.session.mobile = user.mobile;
            //tao ma OTP
            utils.OTP_comfirm_user(user.id);
            //chuyen sang trang xac nhan pass
            res.redirect('/auth/OTP-reset-pass');
        //Nếu không tìm thấy SDT trên hệ thống
        } else {
            req.flash('error_messages', 'Số điện thoại chưa được đăng ký');
            res.redirect('back');
        }
    } catch (ex) {
        console.log(ex);
        res.render('pages/error/500');
    }
};

const getOTPResetPass = async(req, res) => {
    client.TTL('otp_' + req.session.active_user, async(err, reply) => {
        if (err) throw err;
        if (reply < 0) {
            reply = 'Mã OTP đã hết hạn'
        }
        res.render('pages/auth/OTP-reset-pass', {
            title: 'OTP Reset pass',
            layout: 'partials/layout-withoutNav',
            req,
            reply
        });
    });
};

const postOTPResetPass = async(req, res) => {
    try {
        //lấy 6 số khách nhập
        const OTP1 = req.body.dight1;
        const OTP2 = req.body.dight2;
        const OTP3 = req.body.dight3;
        const OTP4 = req.body.dight4;
        const OTP5 = req.body.dight5;
        const OTP6 = req.body.dight6;
        const maOTP = OTP1 + OTP2 + OTP3 + OTP4 + OTP5 + OTP6;
        //chuyen maOTP sang string
        const OTPinput = JSON.stringify(maOTP);
        //chuyen ma OTP trong redis sang string
        client.get('otp_' + req.session.active_user, async(err, reply) => {
            if (err) throw err;
            //chuyển mã trong redis sang string
            const OTPredis = JSON.stringify(reply);
            //so sanh OTPinput voi OTPredis
            //Nếu mã trùng
            if (OTPinput == OTPredis) {
                console.log('Xac thuc OTP reset pass thanh cong!');
                //chuyển sang trang nhập mật khẩu
                res.redirect('/auth/confirmpass')
            } else {
                console.log('Xac thuc OTP reset pass that bai!');
                req.flash('error_messages', 'Mã OTP không đúng!');
                res.redirect('back');
            }
        });
    } catch (ex) {
        console.log(ex);
        res.render('pages/error/500');
    }

};

const getConfirmPass = async(req, res) => {
    res.render('pages/auth/confirm-pass', {
        title: 'Confirmpass',
        layout: 'partials/layout-withoutNav'
    });
};

const postConfirmPass = async(req, res) => {
    try {
        //Nếu pass khách nhập và nhập lại pass trùng nhau
        if (utils.Trim(req.body.password) === utils.Trim(req.body.confirm_password)) {
            //Tìm kiếm ID user
            const user = await userData.findBy({
                id: req.session.active_user
            });
            //update status
            user.update({
                password: await bcrypt.hash(utils.Trim(req.body.password), 12), // password mã hóa
                status: 'active',
            });
            //luu session
            req.session.user = user.id;
            //chuyen sang trang thong bao thay doi thanh cong
            res.redirect('/auth/mess-success-change-pass');
        } else {
            req.flash('error_messages', 'Mật khẩu không khớp! Vui lòng nhập lại');
            res.redirect('back');
        };
    } catch (ex) {
        console.log(ex);
        res.render('pages/error/500');
    }
};

const getMessSuccess = async(req, res) => {
    res.render('pages/auth/mess-success-change-pass', {
        title: 'Success',
        layout: 'partials/layout-withoutNav'
    });
};

const getLogout = async(req, res) => {
    try {
        req.session = null;
        res.redirect('/auth/signin');
    } catch (ex) {
        console.log(ex);
        res.render('pages/error/500');
    }
};

const postUpProfile_Pass = async(req, res) => {
    try {
        const user = await userData.findBy({
            id: req.user.id
        });
        // tìm được user id
        if (user) {
            const compare = await bcrypt.compare(utils.Trim(req.body.old_password), user.password);
            // kiểm tra mk nhập vào và trên db
            if (compare) {
                //Nếu 2 pass khách nhập trùng nhau thì
                if (utils.Trim(req.body.new_password) === utils.Trim(req.body.confirm_password)) {
                    //update password
                    user.update({
                        password: await bcrypt.hash(utils.Trim(req.body.new_password), 12),
                    });
                    req.flash('success_messages', 'Thay đổi mật khẩu thành công');
                //Nếu 2 pass khách nhập không trùng nhau thì
                } else {
                    req.flash('error_messages', 'Mật khẩu mới và mật khẩu xác nhận chưa trùng khớp');
                }
            //nhập sai mật khẩu cũ   
            } else {
                req.flash('error_messages', 'Bạn nhập sai mật khẩu cũ');
            }
            res.redirect('back');
        };
    } catch (ex) {
        console.log(ex);
        res.render('pages/error/500');
    }
}

//============= upload image ==================
const multer = require('multer');
const upload = multer().single('profile_pic');

let handleUploadFile = async(req, res) => {
    // 'profile_pic' is the name of our file input field in the HTML form

    upload(req, res, async function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (!req.file) {
            return res.send('Please select an image to upload');
        } else if (err instanceof multer.MulterError) {
            return res.send(err);
        } else if (err) {
            return res.send(err);
        }

        //upload hình ảnh lên database
        //tìm user đg sử dụng
        const user = await userData.findBy({
            id: req.session.user
        });
        if (user) {
            //update tên hình ảnh vừa upload lên local: public/update
            const upload = user.update({
                img_name: req.file.filename
            });
            req.session.imgUser = user.img_name;
        }

        res.redirect('back');
        // Display uploaded image for user validation
        // res.send(`You have uploaded this image: <hr/><img src="/upload/${req.file.filename}"><hr /><a href="/auth/user_profile">Upload another image</a>`);
    });
};
//===========Đi tới trang User_Profile==============
const getUserProfile = async(req, res) => {
    //tìm id của user đang log in
    const user = await userData.findBy({
        id: req.session.user
    });
    req.session.imgUser = user.img_name;
    res.render('pages/auth/_user_profile', {
        title: 'Thông tin tài khoản',
        page_title: 'Thông tin tài khoản',
        folder: 'Trang chủ',
        req,
    });
};

const UpdateProfile = async(req, res) => {
    try {
        //Tìm Id user vừa chọn
        const user = await userData.findBy({
            id: req.user.id
        });
        if (user) {
            //Tìm SDT vừa nhập có trên hệ thống không
            const mobile_ex = await userData.findBy({
                mobile: utils.Trim(req.body.mobile),
            });
            // Nếu SDT có trên hệ thống
            if (mobile_ex) {
                // Trường hợp chỉ thay đổi tên & email không thay đổi SDT
                if (user.mobile === utils.Trim(req.body.mobile)) {
                    user.update({
                        full_name: utils.Trim(req.body.fullName),
                        email: utils.Trim(req.body.email),
                    });
                    req.flash('success_messages', 'Thành công!');
                } else {
                    req.flash('error_messages', 'Số điện thoại đã có trên hệ thống');
                }
            // Nếu SDT không có trên hệ thống thì cho cập nhật
            } else {
                user.update({
                    full_name: utils.Trim(req.body.fullName),
                    email: utils.Trim(req.body.email),
                    mobile: utils.Trim(req.body.mobile),
                });
                req.flash('success_messages', 'Thành công!');
            }
        //Nếu không tìm được user
        } else {
            req.flash('error_messages', 'Thay đổi thông tin thất bại');
        }
        res.redirect('back')
    } catch (ex) {
        console.log(ex);
        res.render('pages/error/500');
    }
};
// api service
const postApiUserCreate = async(req, res) => {
    try {
        // check mobile exist or not
        const userObj = userModel.create();
        const exist = await utils.findBy(userObj, {
            mobile: utils.Trim(req.body.mobile)
        });
        //Nếu đã tồn tại user
        if (exist) {
            dataHandle.HandleError(res, 409, "User is exist.");
        //Nếu chưa có user    
        } else {
            // Tạo user API
            const user = await utils.createObj(userObj, {
                full_name: utils.Trim(req.body.full_name),
                mobile: utils.Trim(req.body.mobile),
                email: utils.Trim(req.body.email),
                password: await bcrypt.hash(utils.Trim(req.body.password), 12),//password mã hóa
                api_key: utils.generateAPIkey(30),// Tạo API key random 30 ký tự
            });
            // Tạo Nhóm khách hành: Khách hàng thuộc API trong bảng contact
            const listObj = listModel.create();
            const list = await utils.createObj(listObj, {
                user_id: user.id,
                full_name: "Khách hàng thuộc API",
                parent_id: null
            });
            // Thông báo
            dataHandle.HandleSuccess(res, user, list, 'user create success.');
        }
    } catch (e) {
        console.log(e);
        dataHandle.HandleError(res, 500, "Server Internal Error");
    }
};
const getApiUserList = async(req, res) => {
    try {
        const userObj = userModel.create();
        const user = await utils.findAllBy(userObj, {});
        dataHandle.HandleSuccess(res, user, 'success');
    } catch (e) {
        console.log(e);
        dataHandle.HandleError(res, 500, "Server Internal Error");
    }
};

module.exports = {
    getSignup,
    postSignup,
    getLogout,
    getCheckOTP,
    postCheckOTP,
    getSignin,
    postSignin,
    postResend,
    getForgotPass,
    postForgotPass,
    getOTPResetPass,
    postOTPResetPass,
    getConfirmPass,
    postConfirmPass,
    getMessSuccess,
    // profile
    UpdateProfile,
    postUpProfile_Pass,
    getUserProfile,
    //post img
    handleUploadFile,
    //API
    postApiUserCreate,
    getApiUserList,
};