'use strict';
const bcrypt = require('bcrypt');
const constant = require('./../_core/constant');
const utils = require('./../_helper/utils');
const contactData = require('./database/data');
const contactListModel = require('../list/database/model.list_contacts');
const contactModel = require('./database/model.contact');
const listData = require('../list/database/data');
const companyData = require('../company/database/data');
const userData = require('../user/database/data');
const dataHandle = require('./../_helper/dataHandle');
const moment = require('moment');

const getContact = async(req, res) => {
    try {
        if (!req.query.page) {
            res.redirect('/contact/list?page=1');
        } else {
            //số lượng item hiển thị
            const size = 1;
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const data = {
                user_id: req.user.id,
                status: "show"
            }
            const _dataContact = {
                    offset: (page - 1) * size,
                    limit: size,
                    user_id: req.user.id,
                    status: "show"
                }
                //find dữ liệu từ list
            const lists = await listData.findAll(data);
            const listFinal = await utils.listFinal(lists);
            // Kiểm tra xem có tìm kiếm hay không neu co
            if (req.query.key || req.query.sortby) {
                _dataContact.keyword = utils.Trim(req.query.key);
                _dataContact.sortby = utils.Trim(req.query.sortby);
            }
            //find dữ liệu từ company
            const companys = await companyData.findAll(data);
            //find dữ liệu từ contact bằng queryContact
            const contacts = await contactData.queryContact(_dataContact);
            const paging = utils.Paging(req.originalUrl, contacts.count, size, page);

            res.render('pages/contact/contacts_list', {
                title: 'Danh sách Khách hàng',
                page_title: 'Quản lý khách hàng',
                folder: 'Menu',
                req,
                contacts,
                lists,
                listFinal,
                paging,
                companys,
                size,
            });
        };
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    };
};
//add contacts
const postAddContacts = async(req, res) => {
    try {
        let transaction = await req.user.sequelize.transaction();
        try {
            // nếu tìm thấy mobile thì thực hiện >< báo lỗi
            if (utils.Trim(req.body.mobile)) {
                //find mobile từ table contact = mobile input
                const admin_id = await contactData.findByOne({
                    user_id: req.user.id,
                    mobile: utils.Trim(req.body.mobile),
                    status: "show"
                });
                //nếu tìm thấy thì thông báo số điện thoại đã tồn tại
                if (admin_id) {
                    req.flash('error_messages', 'Thất bại! Khách hàng có số điện thoại đã tồn tại đã tồn tại!');
                    res.redirect('back')
                } else {
                    //create contact
                    const addContacts = await contactData.tContactCreate({
                        user_id: req.user.id,
                        full_name: utils.Trim(req.body.full_name),
                        mobile: utils.Trim(req.body.mobile),
                        email: utils.Trim(req.body.email),
                    }, transaction);
                    if (req.body.list_id) {
                        //create list_contact
                        await listData.tContactListCreate({
                            list_id: utils.Trim(req.body.list_id),
                            contact_id: addContacts.id,
                        }, transaction);
                    };
                    if (req.body.company_id) {
                        //create contact_company
                        await companyData.tContactCompanyCreate({
                            contact_id: addContacts.id,
                            company_id: utils.Trim(req.body.company_id),
                        }, transaction);
                    };
                    req.flash('success_messages', 'Thêm khách hàng thành công!');
                    await transaction.commit();
                }
            } else {
                req.flash('error_messages', 'Không tìm thấy')
            }
        } catch (e) {
            console.log(e);
            req.flash('error_messages', 'Có lỗi xảy ra.');
            if (transaction) {
                await transaction.rollback();
            }
        };
        res.redirect('back');
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    };
};
// updete contact
const postUpdateContact = async(req, res) => {
    try {
        //find contact có id vừa chọn
        const contact = await contactData.findByOne({
            id: req.params.contactId
        });
        if (contact) {
            //tim xem contact nao co so mobile nay hay khong
            const exist = await contactData.findByOne({
                    user_id: req.user.id,
                    mobile: utils.Trim(req.body.mobile),
                })
                //nếu tìm thấy contact có mobile
            if (exist) {
                //nếu contact có mobile trùng thì báo lỗi
                if (contact.mobile !== utils.Trim(req.body.mobile)) {
                    req.flash('error_messages', 'Thất bại! Khách hàng có số điện thoại đã tồn tại đã tồn tại!');
                    res.redirect('back')
                } else {
                    contact.update({
                        full_name: req.body.full_name,
                        mobile: req.body.mobile,
                        email: req.body.email,
                    });
                    req.flash('success_messages', 'Thành công!');
                }
            } else {
                // else ko tìm thấy contact có mobile
                contact.update({
                    full_name: req.body.full_name,
                    mobile: req.body.mobile,
                    email: req.body.email,
                });
                req.flash('success_messages', 'Thành công!');
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
//delete contact
const postDeleteContact = async(req, res) => {
    try {
        //find id contact cần xóa
        const contactDelete = await contactData.findByOne({
            id: utils.Trim(req.params.contactId)
        });
        //nếu tìm thấy contact cần delete thì thực thi ko thì báo lỗi
        if (contactDelete) {
            // tìm từ bảng list_contact những id trùng với list_id của bảng contact
            const list_contacts = await listData.findAllContactList({
                contact_id: contactDelete.id
            });
            //tìm những id trùng với list_id từ bảng list_contact xóa trước sau đó xóa contact
            list_contacts.forEach(i => {
                if (i.contact_id === contactDelete.id) {
                    i.destroy();
                }
            });
            // tìm từ bảng contact_company những id trùng với contact_id của bảng contact
            const contactsCompany = await companyData.findAllContactCompany({
                contact_id: contactDelete.id
            });
            //tìm những id trùng với contact_id của bảng contact_company xóa trước sau đó xóa contact
            contactsCompany.forEach(i => {
                if (i.contact_id === contactDelete.id) {
                    i.destroy();
                }
            });
            //find lại contact để delete
            const contactDeletedeplay = await contactData.findByOne({
                id: utils.Trim(req.params.contactId)
            });
            // delete contact
            contactDeletedeplay.update({
                status: "hidden"
            });
            req.flash('success_messages', 'Thành công!');
        } else {
            req.flash('error_messages', 'Không tìm thấy!');
        }
        res.redirect('back');
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};

// tìm kiếm contact
const postSearchContact = async(req, res) => {
    try {
        let param = '';
        if (utils.Trim(req.body.key).length > 0) {
            param += '&key=' + utils.Trim(req.body.key);
        }
        if (parseInt(req.body.sortby) > 0) {
            param += '&sortby=' + req.body.sortby;
        }
        res.redirect('/contact/list?page=1' + param);
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};

const postPreviousContact = async(req, res) => {
    try {
        let page = parseInt(req.params.page);
        page = page - 1;

        if (req.params.key && req.params.sortby == 'none') {
            res.redirect('/contact/list?page=' + page + '&key=' + req.params.key);
        } else if (req.params.key == 'none' && req.params.sortby) {
            res.redirect('/contact/list?page=' + page + '&sortby=' + req.params.sortby);
        } else if (req.params.key && req.params.sortby) {
            res.redirect('/contact/list?page=' + page + '&key=' + req.params.key + '&sortby=' + req.params.sortby);
        }
        res.redirect('/contact/list?page=' + page);
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};

const postNextContact = async(req, res) => {
    try {
        let page = parseInt(req.params.page);
        page = page + 1;

        if (req.params.key && req.params.sortby == 'none') {
            res.redirect('/contact/list?page=' + page + '&key=' + req.params.key);
        } else if (req.params.key == 'none' && req.params.sortby) {
            res.redirect('/contact/list?page=' + page + '&sortby=' + req.params.sortby);
        } else if (req.params.key && req.params.sortby) {
            res.redirect('/contact/list?page=' + page + '&key=' + req.params.key + '&sortby=' + req.params.sortby);
        }
        res.redirect('/contact/list?page=' + page);
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};
//=============list_contact===============
// add list_contact
const postAddContactList = async(req, res) => {
    try {
        // lấy dữ liệu nhập vào
        if (req.body.list_id) {
            const dataContactList = {
                list_id: utils.Trim(req.body.list_id),
                contact_id: utils.Trim(req.params.contactId),
            };
            //nếu tìm thấy biến dataContactList thì thực hiện >< báo lỗi
            if (dataContactList) {
                // create list_contact
                await listData.contactListCreate(dataContactList);
                req.flash('success_messages', 'Thêm thành công!');
            } else {
                req.flash('error_messages', 'Không tìm thấy')
            }
        } else {
            req.flash('error_messages', 'Chưa chọn nhóm khách hàng')
        }
        res.redirect('back')
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};
// edit list_contact
const postEditContactList = async(req, res) => {
    try {
        //lấy id list_contact update
        const contactList = await listData.findByOneContactList({
            id: utils.Trim(req.params.contactsListsId)
        });
        if (contactList) {
            // update cột list_id
            contactList.update({
                list_id: utils.Trim(req.body.list_id)
            });
            req.flash('success_messages', 'Thành công!');
        } else {
            req.flash('error_messages', 'Không tìm thấy!');
        }
        res.redirect('back');
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};
//delete list_contact
const postDeleteContactList = async(req, res) => {
    try {
        // find contactList delete
        const contactlist = await listData.findByOneContactList({
            id: utils.Trim(req.params.contactsListsId)
        });
        if (contactlist) {
            //delete list_contact
            contactlist.destroy();
            req.flash('success_messages', ' Xóa Thành công!');
        } else {
            req.flash('error_messages', 'Không tìm thấy!');
        }
        res.redirect('back');
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};
//===============contact_company==============
// AddContactCompany
const postAddContactCompany = async(req, res) => {
    try {
        //tìm company_id nhập vào >< báo lỗi
        if (req.body.company) {
            //lấy conpany_id và contact_id từ form
            const contactCompany = {
                contact_id: utils.Trim(req.params.contactId),
                company_id: utils.Trim(req.body.company),
            };
            //nếu tìm contactCompany thì thực hiện >< thông báo lỗi
            if (contactCompany) {
                //create contactCompany
                await companyData.contactCompanyCreate(contactCompany);
                req.flash('success_messages', 'Thêm Thành công!');
            } else {
                req.flash('error_messages', 'Không tìm thấy!');
            }
        } else {
            req.flash('error_messages', 'Chưa chọn doanh nghiệp!');
        }
        res.redirect('back');
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};
// Delete Contact_company
const postDeleteContactCompany = async(req, res) => {
    try {
        //find id contactCompany delete
        const contactCompany = await companyData.findByOneContactCompany({
            id: utils.Trim(req.params.contactCompanyId)
        });
        if (contactCompany) {
            //delete contactCompany
            contactCompany.destroy();
            req.flash('success_messages', ' Xóa tệp Thành công!');
        } else {
            req.flash('error_messages', 'Không tìm thấy tệp!');
        }
        res.redirect('back');
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};
// Edit Contact_company
const postEditContactCompany = async(req, res) => {
    try {
        //find id contactCompany update
        const contactCompany = await companyData.findByOneContactCompany({
            contact_id: utils.Trim(req.params.contactId)
        });
        if (contactCompany) {
            // update contactCompany
            contactCompany.update({
                contact_id: utils.Trim(req.params.contactsId),
                company_id: utils(req.body.company)
            });
            req.flash('success_messages', 'Thành công!');
        } else {
            req.flash('error_messages', 'Không tìm thấy!');
        }
        res.redirect('back');
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};
// api service
const postApiContactCreate = async(req, res) => {
    try {
        const contactObj = contactModel.create();
        const contact_listObj = contactListModel.create();
        //find api_key đk = với req.query.id
        const api_key = await userData.findBy({
            api_key: utils.Trim(req.query.id)
        });
        // check mobile exist or not
        const exist = await utils.findBy(contactObj, {
            user_id: api_key.id,
            mobile: utils.Trim(req.body.mobile)
        });
        // tìm ra id của nhóm khách hàng API
        const id_list = await listData.findBy({
            full_name: utils.Trim("Khách hàng thuộc API"),
        });
        if (exist) {
            // contact existed
            dataHandle.HandleError(res, 409, "Contact is exist.");
        } else {
            // contact not exist
            // create contact
            const contact = await utils.createObj(contactObj, {
                user_id: api_key.id,
                full_name: utils.Trim(req.body.full_name),
                mobile: utils.Trim(req.body.mobile),
                email: utils.Trim(req.body.email)
            });
            const contact_list = await utils.createObj(contact_listObj, {
                list_id: id_list.id,
                contact_id: contact.id
            });
            // return data
            dataHandle.HandleSuccess(res, contact, contact_list, 'contact create success.');
        }
    } catch (e) {
        console.log(e);
        dataHandle.HandleError(res, 500, "Server Internal Error");
    }
};
const getApiContactList = async(req, res) => {
    try {
        const contactObj = contactModel.create();
        if (!req.query.id) {
            const contacts = await utils.findAllBy(contactObj, {});
            dataHandle.HandleSuccess(res, contacts, 'success');
        } else {
            const contacts = await utils.findAllBy(contactObj, {
                user_id: req.query.id,
            });
            dataHandle.HandleSuccess(res, contacts, 'success');
        }
    } catch (e) {
        console.log(e);
        dataHandle.HandleError(res, 500, "Server Internal Error");
    }
};
// end api service
//Hướng dẫn sử API
const getContacttRecovery = async(req, res) => {
    try {
        res.render('pages/contact/contact_recovery', {
            title: 'Khôi phục khách hàng',
            page_title: 'Khôi phục khách hàng',
            folder: 'Khôi phục',
            req,
        });
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
}
module.exports = {
    getContact,
    postAddContacts,
    postUpdateContact,
    postDeleteContact,
    postSearchContact,
    postNextContact,
    postPreviousContact,
    postAddContactList,
    postEditContactList,
    postDeleteContactList,
    postAddContactCompany,
    postDeleteContactCompany,
    postEditContactCompany,
    postApiContactCreate,
    getApiContactList,
    getContacttRecovery,
};