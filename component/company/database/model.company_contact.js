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
        contact_id: Sequelize.BIGINT,
        company_id: Sequelize.BIGINT,
        created_date: Sequelize.DATE,
    },
    options: {
        freezeTableName: true,
        // define the table's names
        timestamps: false,
        tableName: 'contact_company'
    }
};

const create = () => {
    return dbconnect.define(config.options.tableName, config.schema, config.options);
};
// Join từ table
const associations = (listModel) => {
    const model = create();
    _.forEach(listModel, (v) => {
        if (v.name === "company") {
            model.belongsTo(v, {
                as: 'comp',
                foreignKey: 'company_id',
                foreignKeyConstraint: true
            });
        }
        if (v.name === "contact") {
            model.belongsTo(v, {
                as: 'contact',
                foreignKey: 'contact_id',
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