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
        tax: Sequelize.STRING,
        mobile: Sequelize.STRING,
        email: Sequelize.STRING,
        address: Sequelize.STRING,
        status: Sequelize.STRING,
        created_date: Sequelize.DATE,
    },
    options: {
        freezeTableName: true,
        // define the table's names
        timestamps: false,
        tableName: 'company'
    }
};

const create = () => {
    return dbconnect.define(config.options.tableName, config.schema, config.options);
};
//join table
const associations = (listModel) => {
    const model = create();
    _.forEach(listModel, (v) => {
        if (v.name === "company_job") {
            model.hasMany(v, {
                as: 'companyJobs',
                foreignKey: 'company_id',
                foreignKeyConstraint: true
            });
        }
        if (v.name === "contact_company") {
            model.hasMany(v, {
                as: 'contact_company',
                foreignKey: 'company_id',
                foreignKeyConstraint: true
            });
        }
        if (v.name === "user") {
            model.belongsTo(v, {
                as: 'user',
                foreignKey: 'user_id',
                foreignKeyConstraint: true
            });
        }
    });

    return model;
};

module.exports = {
    create,
    associations,
};