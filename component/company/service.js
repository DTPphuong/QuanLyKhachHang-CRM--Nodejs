'use strict';
const bcrypt = require('bcrypt');
const constant = require('./../_core/constant');
const utils = require('./../_helper/utils');
const moment = require('moment');
const companyData = require('./database/data');
const jobData = require('../job/database/data');
const contactsData = require('../contact/database/data');

const getCompany = async (req, res) => {
    try {
        if (!req.query.page) {
            res.redirect('/company/list?page=1');
        } else {
            //số lượng item
            const size = 50;
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const data = {
                user_id: req.user.id,
                status: "show"
            };
            const _dataCompany = {
                offset: (page - 1) * size,
                limit: size,
                user_id: req.user.id,
                status: "show"
            };
            //find dữ liệu table job
            const jobs = await jobData.findAll(data);
            // Kiểm tra xem có tìm kiếm hay không
            if (req.query.key) {
                _dataCompany.keyword = utils.Trim(req.query.key);
            }
            //find dữ liệu từ bảng contacts
            const contacts = await contactsData.queryContact(data);
            //find dữ liệu từ company bằng queryCompany
            const companys = await companyData.queryCompany(_dataCompany);
            const paging = utils.Paging(req.originalUrl, companys.count, size, page);

            res.render('pages/company/company_list', {
                title: 'Danh sách Doanh nghiệp',
                page_title: 'Quản lý doanh nghiệp',
                folder: 'Menu',
                req,
                size,
                paging,
                companys,
                jobs,
                contacts,
            });
        };
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    };
};

const postAddCompany = async (req, res) => {
    try {
        let transaction = await req.user.sequelize.transaction();
        try {
            // find mobile && tax đã tồn tại hay chưa
            if (utils.Trim(req.body.mobile) && utils.Trim(req.body.tax)) {
                const mobileContact = await companyData.findByOne({
                    user_id: req.user.id,
                    mobile: utils.Trim(req.body.mobile),
                    status: "show"
                });
                const taxContact = await companyData.findByOne({
                    user_id: req.user.id,
                    tax: utils.Trim(req.body.tax),
                    status: "show"
                });
                //nếu tìm thấy thì thông báo 
                if (mobileContact || taxContact) {
                    req.flash('error_messages', 'Thất bại! Doanh nghiệp có số điện thoại hoặc mã số thuế đã tồn tại đã tồn tại!');
                    res.redirect('back')
                } else {
                    // create company
                    const addCompany = await companyData.tCompanyCreate({
                        user_id: req.user.id,
                        full_name: utils.Trim(req.body.full_name),
                        tax: utils.Trim(req.body.tax),
                        mobile: utils.Trim(req.body.mobile),
                        address: utils.Trim(req.body.address),
                        email: utils.Trim(req.body.email),
                    }, transaction);
                    if (req.body.job_id) {
                        //Create job_company
                        await companyData.tCompanyJobCreate({
                            company_id: addCompany.id,
                            job_id: req.body.job_id,
                        }, transaction);
                    };
                    if (req.body.contact_id) {
                        // create contact_company
                        await companyData.tContactCompanyCreate({
                            contact_id: req.body.contact_id,
                            company_id: addCompany.id,
                        }, transaction);
                    };
                    await transaction.commit();
                    req.flash('success_messages', 'Thành công!');
                }
            } else {
                req.flash('error_messages', 'Không tìm thấy')
            };
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
//delete company
const postDeleteCompany = async (req, res) => {
    try {
        //tìm id company
        const companyDelete = await companyData.findByOne({
            id: req.params.companyId
        });
        if (companyDelete) {
            // tìm từ bảng job_company những id trùng với company_id
            const job_company = await jobData.findAllCompanyJob({
                company_id: companyDelete.id
            });
            //delete job_company
            job_company.forEach(i => {
                if (i.company_id === companyDelete.id) {
                    i.destroy();
                }
            });
            // tìm từ bảng contact_company những id trùng với contact_id
            const contactsCompany = await companyData.findAllContactCompany({
                company_id: companyDelete.id
            });
            //delete contactCompany
            contactsCompany.forEach(i => {
                if (i.company_id === companyDelete.id) {
                    i.destroy();
                }
            });
            //find lại contact delete
            const companyDeletedeplay = await companyData.findByOne({
                id: req.params.companyId
            });
            // delete company
            companyDeletedeplay.update({
                status: "hidden"
            });
            req.flash('success_messages', 'Thành công!');
        } else {
            req.flash('error_messages', 'Không tìm thấy tệp!');
        }
        res.redirect('back');
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};
//edit Company
const postUpdateCompany = async (req, res) => {
    try {
        //tìm id company updata
        const company = await companyData.findByOne({
            id: req.params.companyId
        });
        if (company) {
            //find mobile && tax đã tồn tại hay chưa
            const findmobile = await companyData.findByOne({
                user_id: req.user.id,
                mobile: utils.Trim(req.body.mobile),
            });
            const findtax = await companyData.findByOne({
                user_id:req.user.id,
                tax: req.body.tax,
            });
            //neu tim thay mobile hoac tax tren he thong
            if (findmobile || findtax) {
                //neu thay doi so dien thoai va tax giu nguyen
                if (company === findtax || !findmobile) {
                    company.update({
                        full_name: utils.Trim(req.body.full_name),
                        mobile: utils.Trim(req.body.mobile),
                        address: utils.Trim(req.body.address),
                        email: utils.Trim(req.body.email),
                    });
                    req.flash('success_messages', 'Thành công!');
                //neu thay doi tax va giu nguyen sdt
                }else if(company === findmobile || !findtax){
                    company.update({
                        full_name: utils.Trim(req.body.full_name),
                        address: utils.Trim(req.body.address),
                        email: utils.Trim(req.body.email),
                        tax: utils.Trim(req.body.tax),
                    });
                    req.flash('success_messages', 'Thành công!');
                //neu giu nguyen sdt & tax
                }else if(req.body.mobile === company.mobile && req.body.tax === company.tax){
                    company.update({
                        full_name: utils.Trim(req.body.full_name),
                        address: utils.Trim(req.body.address),
                        email: utils.Trim(req.body.email),
                    });
                    req.flash('success_messages', 'Thành công!');
                }else {
                    req.flash('error_messages', 'Thất bại! Doanh nghiệp có số điện thoại hoặc mã số thuế đã tồn tại đã tồn tại!');
                    res.redirect('back')
                }
            } else {
                //neu so dien thoai hoac tax ko co tren he thong thi cho update
                company.update({
                    full_name: utils.Trim(req.body.full_name),
                    address: utils.Trim(req.body.address),
                    email: utils.Trim(req.body.email),
                    mobile: utils.Trim(req.body.mobile),
                    tax: utils.Trim(req.body.tax),
                });
                req.flash('success_messages', 'Thành công!');
            }
        } else {
            req.flash('error_messages', 'Không tìm thấy tệp!');
        }
        res.redirect('back');
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};
// tìm kiếm company
const postSearchCompany = async (req, res) => {
    try {
        let param= '';
        if (utils.Trim(req.body.key).length > 0) {
            param += '&key=' + utils.Trim(req.body.key);
        }
        res.redirect('/company/list?page=1' + param);
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};

const postPreviousCompany = async (req, res) => {
    try {
        let page = parseInt(req.params.page);
        page = page - 1;
        if (!req.params.key) {
            res.redirect('/company/list?page=' + page);
        } else {
            res.redirect('/company/list?page=' + page + '&key=' + req.params.key);
        }
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};

const postNextCompany = async (req, res) => {
    try {
        let page = parseInt(req.params.page);
        page = page + 1;
        if (!req.params.key) {
            res.redirect('/company/list?page=' + page);
        } else {
            res.redirect('/company/list?page=' + page + '&key=' + req.params.key);
        }
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};
//==============job_company=================
//add job_company
const postAddCompanyJob = async (req, res) => {
    try {
        if (req.body.job_id) {
            const data = {
                company_id: req.params.companyId,
                job_id: req.body.job_id
            }
            if (data) {
                // create companyjob
                await jobData.companyJobCreate(data);
                req.flash('success_messages', 'Thêm thành công!');
            } else {
                req.flash('error_messages', 'Không tìm thấy')
            }
        } else {
            req.flash('error_messages', 'Chưa chọn ngành nghề!')
        }
        res.redirect('back')
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};
// edit job_company
const postEditCompanyJob = async (req, res) => {
    try {
        //find id job_company update
        const companyJob = await jobData.findByOneCompanyJob({
            id: req.params.companyJobId,
        });
        if (companyJob) {
            // update cột job_id
            companyJob.update({
                job_id: req.body.job_id
            });
            req.flash('success_messages', 'Thành công!');
        } else {
            req.flash('error_messages', 'Không tìm thấy tệp!');
        }
        res.redirect('back');
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};
//delete job_company
const postDeleteCompanyJob = async (req, res) => {
    try {
        //find id job_company delete
        const data = await jobData.findByOneCompanyJob({
            id: req.params.companyJobId
        });
        if (data) {
            //delete job_company
            data.destroy();
            req.flash('success_messages', ' Xóa Thành công!');
        } else {
            req.flash('error_messages', 'Không tìm thấy tệp!');
        }
        res.redirect('back');
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};
//================ContactsCompany================
//add_contacts Company
const postAddContactCompany = async (req, res) => {
    try {
        if (req.body.contact_id) {
            const data = {
                company_id: req.params.companyId,
                contact_id: req.body.contact_id
            }
            if (data) {
                //Create contactCompany
                await contactsData.contactCompanyCreate(data);
                req.flash('success_messages', 'Thêm thành công!');
            } else {
                req.flash('error_messages', 'Không tìm thấy')
            }
        } else {
            req.flash('error_messages', 'Chưa chọn khách hàng!')
        }
        res.redirect('back')
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};
// edit job_company
const postEditContactCompany = async (req, res) => {
    try {
        //find id contact_company update
        const contactCompany = await contactsData.findByOneContactCompany({
            id: req.params.contactCompanyId,
        });
        if (contactCompany) {
            // update cột contact_id
            contactCompany.update({
                contact_id: req.body.contact_id
            });
            req.flash('success_messages', 'Thành công!');
        } else {
            req.flash('error_messages', 'Không tìm thấy tệp!');
        }
        res.redirect('back');
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};
//delete contact_company
const postDeleteContactCompany = async (req, res) => {
    try {
        //find id contact_company delete
        const data = await contactsData.findByOneContactCompany({
            id: req.params.contactCompanyId
        });
        if (data) {
            //delete contact_company
            data.destroy();
            req.flash('success_messages', ' Xóa Thành công!');
        } else {
            req.flash('error_messages', 'Không tìm thấy tệp!');
        }
        res.redirect('back');
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};

module.exports = {
    getCompany,
    postAddCompany,
    postDeleteCompany,
    postUpdateCompany,
    postSearchCompany,
    postPreviousCompany,
    postNextCompany,
    postAddCompanyJob,
    postEditCompanyJob,
    postDeleteCompanyJob,
    postAddContactCompany,
    postEditContactCompany,
    postDeleteContactCompany,
};
