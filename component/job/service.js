'use strict';

const bcrypt = require('bcrypt');
const utils = require('./../_helper/utils');
const jobData = require('./database/data');
const constant = require('./../_core/constant');
const moment = require('moment');

const getlist = async(req, res) => {
    try {
        // nếu URL chưa đúng định dạng (có truy vấn page) thì đổi lại cho đúng
        if (!req.query.page) {
            res.redirect('/job/list?page=1');
        }
        const size = 2;
        //nếu có page thì hiện page còn không có page thì hiện 1
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const _dataList = {
            offset: (page - 1) * size,
            limit: size,
            user_id: req.user.id,
            status: "show"
        };
        // Kiểm tra xem có tìm kiếm hay không
        if (req.query.key) {
            _dataList.keyword = utils.Trim(req.query.key);
        }
        //query find all and count
        const jobs = await jobData.queryJobs(_dataList);
        //phân trang
        const paging = utils.Paging(req.originalUrl, jobs.count, size, page);
        res.render('pages/job/list_job', {
            title: 'Danh sách ngành nghề',
            page_title: 'Quản lý ngành nghề',
            folder: 'Menu',
            req,
            jobs,
            //phân trang
            size,
            paging,
        });
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};

const postAddList = async(req, res) => {
    try {
        //lấy giá trị từ from
        const data = {
            user_id: req.user.id,
            full_name: utils.Trim(req.body.title),
            status: "show",
        };
        if (data) {
            //kiểm tra xem job đã tồn tại hay chưa
            const exist = await jobData.findBy({
                user_id: data.user_id,
                full_name: data.full_name,
                status: "show"
            });
            //nếu tồn tại job
            if (exist) {
                req.flash('error_messages', 'Thất bại! Ngành nghề đã tồn tại');
                res.redirect('back');
            //nếu chưa có job thì thêm vào
            } else {
                await jobData.jobCreate(data);
                req.flash('success_messages', 'Thêm thành công!');
            }
        } else {
            req.flash('error_messages', 'Không tìm thấy!');
        }
        res.redirect('back');
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};

const postJobUpdate = async(req, res) => {
    try {
        //tìm id của Job cần sửa
        const job = await jobData.findBy({
            id: req.params.jobId,
        });
        //nếu tìm thấy id job cần sửa
        if (job) {
            //Tìm xem trên db có tên cần thay đổi hay chưa
            const exist = await jobData.findBy({
                user_id: req.user.id,
                full_name: utils.Trim(req.body.jobs),
                status: "show",
            });
            //Nếu tồn tại tên trên hệ thống
            if (exist) {
                req.flash('error_messages', 'Thất bại! Ngành nghề đã tồn tại');
                res.redirect('back');
            //Nếu chưa có thì cho update
            } else {
                job.update({
                    full_name: utils.Trim(req.body.jobs),
                });
                req.flash('success_messages', 'Thành công!');
            }
        //nếu tìm không thấy job    
        } else {
            req.flash('error_messages', 'Thất bại!');
        }
        res.redirect('back');
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};
const postJobDelete = async(req, res) => {
    try {
        //tìm id trong db Job cần xóa
        const job = await jobData.findBy({
            id: req.params.jobId
        });
        //nếu tìm thấy id job cần xóa
        if (job) {
            // Đổi trạng thái job
            job.update({
                status: 'hidden'
            });
            req.flash('success_messages', 'Thành công!');
        //Nếu không tìm thấy id job    
        } else {
            req.flash('error_messages', 'Thất bại!');
        }
        res.redirect('back')
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};

//search
const postJobSearch = async(req, res) => {
    try {
        let param = '';
        if(utils.Trim(req.body.key).length > 0){
            param += '&key=' + utils.Trim(req.body.key);
        }
        res.redirect('/job/list?page=1'+ param);
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};

const postPreviousJob = async(req, res) => {
    try {
        let page = parseInt(req.params.page);
        page = page - 1;
        let param = '';
        
        if ((utils.Trim(req.params.key)).length > 0) {
            param += '&key=' + utils.Trim(req.params.key)
        }
        res.redirect('/job/list?page=' + page + param);
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};

const possNextJob = async(req, res) => {
    try {
        console.log('1');
        let page = parseInt(req.params.page);
        page = page + 1;
        let param = '';
        
        if ((utils.Trim(req.params.key)).length > 0) {
            param += '&key=' + utils.Trim(req.params.key)
        }
        res.redirect('/job/list?page=' + page + param);
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};
module.exports = {
    getlist,
    postAddList,
    postJobUpdate,
    postJobDelete,
    postJobSearch,
    possNextJob,
    postPreviousJob,
};