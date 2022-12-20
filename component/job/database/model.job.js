'use strict';
const _ = require("lodash");

const Sequelize = require('sequelize');

const config = {
    schema: {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: Sequelize.BIGINT,
        full_name: Sequelize.STRING,
        status: Sequelize.STRING,
    },
    options: {
        freezeTableName: true,
        // define the table's names
        timestamps: false,
        tableName: 'job'
    }
};

const create = () => {
    return dbconnect.define(config.options.tableName, config.schema, config.options);
};

module.exports = {
    create,
};