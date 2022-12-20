'use strict';

const constants = require('./../_core/constant');
const moment = require('moment');
const utils = require('./../_helper/utils');
const listModel = require('./database/model.list');
const listData = require('./database/data');
const userChildrenData = require('./../user/database/data');
const { update } = require('lodash');


const getlist = async(req, res) => {
    try {
        if (!req.query.page) {
            res.redirect('/list/list?page=1');
        } else {
            //mỗi trang 5 item
            const size = 50;
            //nếu có page thì hiện page còn không có page thì hiện 1
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const data = {
                user_id: req.user.id,
                status: "show"
            };
            //dữ liệu để phân trang
            const datalist = {
                offset: (page - 1) * size,
                limit: size,
                user_id: req.user.id,
                status: "show"
            };
            // kiem tr xem co tim kiem hay khong
            if (req.query.key) {
                data.keyword = utils.Trim(req.query.key);
            }
            // lấy tất cả danh sách
            const list_Arr = await listData.findAll(datalist);
            const lists = await listData.findAll(data);
            //
            let listsFinal = utils.listFinal(lists);
            let listsFinals = utils.listFinal(list_Arr);
            //nếu search
            if (req.query.key) {
                listsFinal = lists;
            }


            res.render('pages/list/list', {
                title: 'Quản lý nhóm khách hàng',
                page_title: 'Quản lý nhóm khách hàng',
                folder: 'Menu',
                lists,
                listsFinal,
                listsFinals,
                req,
                list_Arr,
            });

        }
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};
//thêm tệp khách
const postlist = async(req, res) => {
    try {
        const data = {
            user_id: req.user.id,
            full_name: utils.Trim(req.body.full_name),
            parent_id: req.body.parent_id,
        };
        //lưu dữ liệu vào db
        if (data) {
        await listData.listCreate(data);
            req.flash('success_messages', 'Đã thêm tệp khách hàng');
        } else {
            req.flash('error_messages', 'Thất bại');
        }
        res.redirect('back')
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};
// edit tệp khách
const postlistEdit = async(req, res) => {
    try {
        //find list id for update
        const list = await listData.findBy({
            id: req.params.listId
        });
        if (list) {
            //kiếm cha để update
            const parent_id = list.parent_id;
            //kiếm con để update
            const children = await listData.findAll({
                parent_id: list.id,
            });

            //nếu kiếm được con
            if ((children.length !== 0)) {
                //nếu chỉ thay đổi tên, ko thay đổi tệp
                if (list.parent_id == req.body.parent) {
                    list.update({
                        full_name: utils.Trim(req.body.full_name),
                    });
                    //thay đổi cả tên và tệp hoặc chỉ thay đổi tệp
                } else if ((list.parent_id == null) == (req.body.parent == 0)) {
                    list.update({
                        full_name: utils.Trim(req.body.full_name),
                    });
                } else {
                    //update con lên 1 bậc
                    children.forEach(i => {
                            i.update({
                                //update bậc của con
                                parent_id: parent_id === 0 ? null : parent_id,
                            });
                        })
                        //update tk nhập vào
                    list.update({
                        full_name: utils.Trim(req.body.full_name),
                        //kiếm parent_id: gtri nhập vào =0 thì là null khác 0 thì thấy parent nhập vào
                        parent_id: parseInt(req.body.parent) === 0 ? null : parseInt(req.body.parent),
                    });
                }
                //TH nếu không có con
            } else if ((children.length === 0)) {
                list.update({
                    full_name: utils.Trim(req.body.full_name),
                    //kiếm parent_id: gtri nhập vào =0 thì là null khác 0 thì thấy parent nhập vào
                    parent_id: parseInt(req.body.parent) === 0 ? null : parseInt(req.body.parent),
                });
            }
            req.flash('success_messages', 'Thành công!');

        } else {
            req.flash('error_messages', 'Không tìm thấy tệp!');
        }
        res.redirect('back')
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};
//delete tệp khách
const postlistDelete = async(req, res) => {
    try {
        //find list by id for delete
        const list = await listData.findBy({
            id: req.params.listId
        });
        if (list) {
            //get parent_id of list deleting
            const parent_id = list.parent_id;
            //get all children of list deleting
            const children = await listData.findAll({
                parent_id: list.id,
            });
            //find list by id form ContactList
            children.forEach(j => {
                j.update({
                    parent_id: parseInt(parent_id),
                });
            });
            if (parent_id === null) {
                children.forEach(f => {
                    f.update({
                        parent_id: null,
                    });
                });
            }
            //sau khi cap nhap children, kiếm id để xóa
            const _list = await listData.findBy({
                id: req.params.listId
            });

            //kiểm tra khóa ngoại bảng list_contact và khóa chính của list
            const list_contact = await listData.findByOneContactList({
                list_id: req.params.listId
            });
            if (list_contact) {
                req.flash('error_messages', 'Có dữ liệu trong bảng quản lý khách hàng');
            } else {
                _list.update({
                    parent_id: null,
                    status: 'hidden'
                });
                req.flash('success_messages', 'Thành công!');
            }

        }
        res.redirect('back');
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};
// search
const postSearch = async(req, res) => {
    try {
        if (utils.Trim(req.body.key).length > 0) {
            res.redirect('/list/list?page=1&key=' + utils.Trim(req.body.key));
        } else {
            res.redirect('/list/list?page=1');
        }
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};
const getListRecovery = async(req, res) => {
    try {
        res.render('pages/list/list_recovery', {
            title: 'Khôi phục tệp khách',
            page_title: 'Khôi phục tệp khách',
            folder: 'Khôi phục',
            req,
        });
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
}
module.exports = {
    getlist,
    postlist,
    postlistEdit,
    postlistDelete,
    postSearch,
    getListRecovery
};