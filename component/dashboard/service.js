'use strict';

const constants = require('./../_core/constant');
const moment = require('moment');
const utils = require('./../_helper/utils');
const userChildrenData = require('./../user/database/data');

const getDashboard = async(req, res) => {
    try {
        //lấy hình ảnh profile
        req.session.imgUser = req.user.img_name;
        res.render('pages/auth/index', {
            title: 'Dashboard',
            page_title: 'Dashboard',
            folder: 'Dashboard',
            req,
        });
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};
module.exports = {
    getDashboard
};