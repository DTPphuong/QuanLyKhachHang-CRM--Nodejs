'use strict';
const constant = require('./../../_core/constant');
const contactModel = require('./model.contact');
const listModel = require('../../list/database/model.list');
const userModel = require('../../user/database/model.user');
const companyModel = require('../../company/database/model.company');
const contactCompanyModel = require('../../company/database/model.company_contact');
const contactListModel = require('../../list/database/model.list_contacts');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const findAll = async (data) => {
    const _obj = contactModel.create();

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
    if (data.mobile) {
        if (!options.where) options.where = {};
        options.where.mobile = data.mobile;
    }
    if (data.email) {
        if (!options.where) options.where = {};
        options.where.email = data.email;
    }
    if (data.status) {
        if (!options.where) options.where = {};
        options.where.status = data.status;
    }

    return _obj.findAll(options)
};
const findByOne = async (data) => {
    const _obj = contactModel.create();

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
    if (data.mobile) {
        if (!options.where) options.where = {};
        options.where.mobile = data.mobile;
    }
    if (data.email) {
        if (!options.where) options.where = {};
        options.where.email = data.email;
    }
    if (data.status) {
        if (!options.where) options.where = {};
        options.where.status = data.status;
    }

    return _obj.findOne(options);
};

const contactCreate = async (data) => {
    const obj = contactModel.create();
    return obj.create(data);
};
//transaction
const tContactCreate = async (data, t) => {
    const obj = contactModel.create();
    return obj.create(data, { transaction: t });
};

const queryContact = (data) => {
    // join table contact -> list_contact -> list
    const list = listModel.create();
    const list_contact = contactListModel.associations([list]);
    //join table contact -> contact_company -> company
    const company = companyModel.create();
    const contactCompany = contactCompanyModel.associations([company]);
    //join table contact -> user
    const user = userModel.create();
    const _obj = contactModel.associations([list_contact, contactCompany, user]);

    const options = {
        distinct: true,
        offset: data.offset,
        limit: data.limit,
        order: [
            ['id', 'DESC']
        ],
        include: [
            {
            model: list_contact,
            as: 'contactsLists',
            include: [{
                model: list,
                as: 'lists',
            }]
        }, {
            model: contactCompany,
            as: 'contactCompanies',
            include: [{
                model: company,
                as: 'comp'
            }]
        }, {
            model: user,
            as: 'user',
        },],
    }

    if (data.keyword) {
        options.where = {
            [Op.or]: [
                { full_name: { [Op.like]: '%' + data.keyword + '%' } },
                { mobile: { [Op.like]: '%' + data.keyword + '%' } },
                { email: { [Op.like]: '%' + data.keyword + '%' } },
            ]
        }
    }
    if(data.sortby){
        if (!options.include[0].where) options.include[0].where = {};
        options.include[0].where.list_id = data.sortby;
    }
    if (data.user_id) {
        if (!options.where) options.where = {};
        options.where.user_id = data.user_id;
    }
    if (data.status) {
        if (!options.where) options.where = {};
        options.where.status = data.status;
    }

    return _obj.findAndCountAll(options);
};
//==================contactCompany================
const contactCompanyCreate = async (data) => {
    const obj = contactCompanyModel.create();
    return obj.create(data);
};
const findByOneContactCompany = async (data) => {
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

module.exports = {
    findAll,
    findByOne,
    contactCreate,
    tContactCreate,
    queryContact,
    contactCompanyCreate,
    findByOneContactCompany,
};