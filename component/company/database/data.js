'use strict';
const constant = require('./../../_core/constant');
const companyModel = require('./model.company');
const jobModel = require('../../job/database/model.job');
const userModel = require('../../user/database/model.user');
const contactModel = require('../../contact/database/model.contact');
const contactCompanyModel = require('../database/model.company_contact');
const companyJobModel = require('../../job/database/model.job_company');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const findAll = async(data) => {
    const _obj = companyModel.create();

    const options = {};
    if (data.user_id) {
        if (!options.where) options.where = {};
        options.where.user_id = data.user_id;
    }
    if (data.id) {
        if (!options.where) options.where = {};
        options.where.id = data.id;
    }
    if (data.full_name) {
        if (!options.where) options.where = {};
        options.where.full_name = data.full_name;
    }
    if (data.tax) {
        if (!options.where) options.where = {};
        options.where.tax = data.tax;
    }
    if (data.mobile) {
        if (!options.where) options.where = {};
        options.where.mobile = data.mobile;
    }
    if (data.email) {
        if (!options.where) options.where = {};
        options.where.email = data.email;
    }
    if (data.address) {
        if (!options.where) options.where = {};
        options.where.address = data.address;
    }
    if (data.status) {
        if (!options.where) options.where = {};
        options.where.status = data.status;
    }
    
    return _obj.findAll(options);
};

const findByOne = async(data) => {
    const _obj = companyModel.create();

    const options = {};
    if (data.user_id) {
        if (!options.where) options.where = {};
        options.where.user_id = data.user_id;
    }
    if (data.id) {
        if (!options.where) options.where = {};
        options.where.id = data.id;
    }
    if (data.full_name) {
        if (!options.where) options.where = {};
        options.where.full_name = data.full_name;
    }
    if (data.tax) {
        if (!options.where) options.where = {};
        options.where.tax = data.tax;
    }
    if (data.mobile) {
        if (!options.where) options.where = {};
        options.where.mobile = data.mobile;
    }
    if (data.email) {
        if (!options.where) options.where = {};
        options.where.email = data.email;
    }
    if (data.address) {
        if (!options.where) options.where = {};
        options.where.address = data.address;
    }
    if (data.status) {
        if (!options.where) options.where = {};
        options.where.status = data.status;
    }
    
    return _obj.findOne(options);
};

const companyCreate = async(data) => {
    const obj = companyModel.create();
    return obj.create(data)
};
//dùng cho transaction
const tCompanyCreate = async(data, t) => {
    const obj = companyModel.create();
    return obj.create(data, { transaction: t })
};
const queryCompany = (data) => {
    //join table company -> company_job -> job
    const job = jobModel.create();
    const companyJob = companyJobModel.associations([job]);
    //join table company -> contact_company -> contact
    const contact = contactModel.create();
    const contact_company = contactCompanyModel.associations([contact]);
    //join table company -> user
    const user = userModel.create();
    const _obj = companyModel.associations([companyJob, contact_company, user]);

    const options = {
        distinct: true,
        offset: data.offset,
        limit: data.limit,
        order: [
            ['id', 'DESC']
        ],
        include: [
            {
                model: companyJob,
                as: 'companyJobs',
                include: [
                    {
                        model: job,
                        as: 'jobs',
                    }
                ]
            },{
                model: contact_company,
                as: 'contact_company',
                include: [
                    {
                        model: contact,
                        as: 'contact',
                    }
                ]
            },{
                model: user,
                as: 'user',
            },
        ]
    };
    if(data.keyword){
        options.where = {
            [Op.or]: [
                { full_name: {[Op.like]: '%' + data.keyword + '%'} },
                { tax: {[Op.like]: '%' + data.keyword + '%'} },
                { mobile: {[Op.like]: '%' + data.keyword + '%'} },
                { address: {[Op.like]: '%' + data.keyword + '%'}},
                { email: {[Op.like]: '%' + data.keyword + '%'}}
            ]
        }
    }
    if(data.user_id){
        if (!options.where) options.where = {};
        options.where.user_id = data.user_id;
    }
    if (data.status) {
        if (!options.where) options.where = {};
        options.where.status = data.status;
    }
    
    return _obj.findAndCountAll(options);
};
//=================contactCompany=================
const findAllContactCompany = async(data) => {
    const _obj = contactCompanyModel.create();
    const options = {};

    if (data.contact_id) {
        if (!options.where) options.where = {};
        options.where.contact_id = data.contact_id;
    }
    return _obj.findAll(options);
};

const findByOneContactCompany = async(data) => {
    const _obj = contactCompanyModel.create();

    const options = {};
    if (data.user_id) {
        if (!options.where) options.where = {};
        options.where.user_id = data.user_id;
    }
    if (data.id) {
        if (!options.where) options.where = {};
        options.where.id = data.id;
    }
    if (data.contact_id) {
        if (!options.where) options.where = {};
        options.where.contact_id = data.contact_id;
    }
    if (data.company_id) {
        if (!options.where) options.where = {};
        options.where.company_id = data.company_id;
    }

    return _obj.findOne(options);
};

const contactCompanyCreate = async(data) => {
    const obj = contactCompanyModel.create();
    return obj.create(data)
};
//dùng cho transaction
const tContactCompanyCreate = async(data, t) => {
    const obj = contactCompanyModel.create();
    return obj.create(data, { transaction: t })
};
//====================job Company======================
const companyJobCreate = async(data) => {
    const obj = companyJobModel.create();
    return obj.create(data)
};
//dùng cho transaction
const tCompanyJobCreate = async(data, t) => {
    const obj = companyJobModel.create();
    return obj.create(data, { transaction: t })
};

module.exports = {
    findByOne,
    findAll,
    companyCreate,
    tCompanyCreate,
    queryCompany,
    findAllContactCompany,
    findByOneContactCompany,
    contactCompanyCreate,
    companyJobCreate,
    tCompanyJobCreate,
    tContactCompanyCreate,
};