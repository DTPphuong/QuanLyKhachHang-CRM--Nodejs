'use strict';

const constants = require('./../_core/constant');
const moment = require('moment');
const utils = require('./../_helper/utils');

const getUserManual = async (req, res) => {
   try {
      //lấy hình ảnh profile
      req.session.imgUser = req.user.img_name;
      res.render('pages/usermanual/forms-wizard', {
         title: 'Hướng dẫn sử dụng',
         page_title: 'Hướng dẫn sử dụng',
         folder: 'Menu',
         req,
      });
   } catch (e) {
      console.log(e);
      res.render('pages/error/500');
   }
};
module.exports = {
   getUserManual,
};
