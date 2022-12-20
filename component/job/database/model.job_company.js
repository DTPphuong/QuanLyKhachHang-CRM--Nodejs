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
        company_id: Sequelize.BIGINT,
        job_id: Sequelize.BIGINT,
        created_date: Sequelize.DATE,
    },
    options: {
        freezeTableName: true,
        // define the table's names
        timestamps: false,
        tableName: 'company_job'
    }
};

const create = () => {
    return dbconnect.define(config.options.tableName, config.schema, config.options);
};
// Join từ bảng company qua bảng job
const associations = (listModel) => {
    const model = create();
    _.forEach(listModel, (v) => {
        if (v.name === "job") {
            model.belongsTo(v, {
                as: 'jobs',
                foreignKey: 'job_id',
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