'use strict';
const constant = require('./../../_core/constant');
const jobModel = require('./model.job');
const companyJobModel = require('./model.job_company');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const findAll = async(data) => {
    const _obj = jobModel.create();

    const options = {};
    if (data.user_id) {
        if (!options.where) options.where = {};
        options.where.user_id = data.user_id;
    }
    if (data.role) {
        if (!options.where) options.where = {};
        options.where.role = data.role;
    }
    if (data.id) {
        if (!options.where) options.where = {};
        options.where.id = data.id;
    }
    if (data.status) {
        if (!options.where) options.where = {};
        options.where.status = data.status;
    }
    if (data.full_name) {
        if (!options.where) options.where = {};
        options.where.full_name = data.full_name;
    }

    return _obj.findAll(options)
};

const findBy = async(data) => {
    const _obj = jobModel.create();

    const options = {};
    if (data.id) {
        if (!options.where) options.where = {};
        options.where.id = data.id;
    }
    if (data.user_id) {
        if (!options.where) options.where = {};
        options.where.user_id = data.user_id;
    }
    if (data.full_name) {
        if (!options.where) options.where = {};
        options.where.full_name = data.full_name;
    }
    if (data.role) {
        if (!options.where) options.where = {};
        options.where.role = data.role;
    }
    if (data.status) {
        if (!options.where) options.where = {};
        options.where.status = data.status;
    }

    return _obj.findOne(options)
};

const jobCreate = async(data) => {
    const obj = jobModel.create();
    return obj.create(data)
};
//=================== jobs Company =================
const companyJobCreate = async(data) => {
    const obj = companyJobModel.create();
    return obj.create(data)
};
const findByOneCompanyJob = async(data) => {
    const _obj = companyJobModel.create();

    const options = {};
    if (data.user_id) {
        if (!options.where) options.where = {};
        options.where.user_id = data.user_id;
    }
    if (data.id) {
        if (!options.where) options.where = {};
        options.where.id = data.id;
    }
    if (data.company_id) {
        if (!options.where) options.where = {};
        options.where.company_id = data.company_id;
    }
    if (data.job_id) {
        if (!options.where) options.where = {};
        options.where.job_id = data.job_id;
    }

    return _obj.findOne(options)
};
const findAllCompanyJob = async(data) => {
    const _obj = companyJobModel.create();

    const options = {};
    if (data.user_id) {
        if (!options.where) options.where = {};
        options.where.user_id = data.user_id;
    }
    return _obj.findAll(options)
};

const queryJobs = async(data) => {
    const Job = jobModel.create();
    const options = {
        distinct: true,
        offset: data.offset,
        limit: data.limit,
        order: [
            ['id', 'DESC']
        ],
    };
    if (data.keyword) {
        if (!options.where) options.where = {};
        options.where.full_name = {
            [Op.like]: '%' + data.keyword + '%'
        };
    }
    if (data.user_id) {
        if (!options.where) options.where = {};
        options.where.user_id = data.user_id;
    }
    if (data.status) {
        if (!options.where) options.where = {};
        options.where.status = data.status;
    }
    
    return Job.findAndCountAll(options);
}

module.exports = {
    findBy,
    findAll,
    jobCreate,
    companyJobCreate,
    findByOneCompanyJob,
    findAllCompanyJob,
    queryJobs
};