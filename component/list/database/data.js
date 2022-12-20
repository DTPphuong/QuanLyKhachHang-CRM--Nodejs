'use strict';
const constant = require('./../../_core/constant');
const listModel = require('./model.list');
const contactList = require('./model.list_contacts');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const findAll = async(data) => {
    const _obj = listModel.create();
    const options = {};
    if (data.keyword) {
        if (!options.where) options.where = {};
        options.where = {
            [Op.or]: [{
                    full_name: {
                        [Op.like]: '%' + data.keyword + '%'
                    }
                },
                {
                    created_date: {
                        [Op.like]: '%' + data.keyword + '%'
                    }
                },
            ]
        }
    }
    if (data.user_id) {
        if (!options.where) {
            options.where = {};
        }
        options.where.user_id = data.user_id;
    }
    if (data.parent_id) {
        if (!options.where) {
            options.where = {};
        }
        options.where.parent_id = data.parent_id;
    }
    if (data.status) {
        if (!options.where) options.where = {};
        options.where.status = data.status;
    }

    return _obj.findAll(options)
};
const findBy = async(data) => {
    const _obj = listModel.create();
    const options = {};

    if (data.id) {
        if (!options.where) {
            options.where = {};
        }
        options.where.id = data.id;
    }
    if (data.user_id) {
        if (!options.where) options.where = {};
        options.where.user_id = data.user_id;
    }
    if(data.full_name){
        if (!options.where) options.where = {};
        options.where.full_name = data.full_name;
    }
    if (data.status) {
        if (!options.where) options.where = {};
        options.where.status = data.status;
    }
    return _obj.findOne(options);
};
const listCreate = async(data) => {
    const obj = listModel.create();
    return obj.create(data);
};
//================list_contact=============
const contactListCreate = async(data) => {
    const _obj = contactList.create();
    return _obj.create(data);
};
// transaction
const tContactListCreate = async(data, t) => {
    const _obj = contactList.create();
    return _obj.create(data, { transaction: t });
};

const findAllContactList = async(data) => {
    const _obj = contactList.create();
    const options = {};

    if (data.user_id) {
        if (!options.where) options.where = {};
        options.where.user_id = data.user_id;
    }
    return _obj.findAll(options);
};
const findByOneContactList = async(data) => {
    const _obj = contactList.create();
    const options = {};

    if (data.user_id) {
        if (!options.where) options.where = {};
        options.where.user_id = data.user_id;
    }
    if (data.id) {
        if (!options.where) options.where = {};
        options.where.id = data.id;
    }
    if (data.list_id) {
        if (!options.where) options.where = {};
        options.where.list_id = data.list_id;
    }
    if (data.contact_id) {
        if (!options.where) options.where = {};
        options.where.contact_id = data.contact_id;
    }

    return _obj.findOne(options);
};


module.exports = {
    findAll,
    findBy,
    listCreate,
    contactListCreate,
    tContactListCreate,
    findAllContactList,
    findByOneContactList,
};