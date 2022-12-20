'use strict';
const userModel = require('./model.user');
const constant = require('./../../_core/constant');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const findBy = async(data) => {
    const _obj = userModel.create();

    const options = {};
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
    if (data.role) {
        if (!options.where) options.where = {};
        options.where.role = data.role;
    }
    if (data.password) {
        if (!options.where) options.where = {};
        options.where.password = data.password;
    }
    if (data.api_key) {
        if (!options.where) options.where = {};
        options.where.api_key = data.api_key;
    }

    return _obj.findOne(options)
};

const findAll = async(data) => {
    const _obj = userModel.create();

    const options = {};
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
    if (data.role) {
        if (!options.where) options.where = {};
        options.where.role = data.role;
    }
    if (data.api_key) {
        if (!options.where) options.where = {};
        options.where.api_key = data.api_key;
    }

    return _obj.findAll(options)
};

const userCreate = async(data) => {
    const obj = userModel.create();
    return obj.create(data)
};


module.exports = {
    findBy,
    userCreate,
    findAll,
};