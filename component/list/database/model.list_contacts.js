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
        list_id: Sequelize.BIGINT,
        contact_id: Sequelize.BIGINT,
        created_date: Sequelize.DATE,
    },
    options: {
        freezeTableName: true,
        // define the table's names
        timestamps: false,
        tableName: 'contact_list'
    }
};

const create = () => {
    return dbconnect.define(config.options.tableName, config.schema, config.options);
};
//Join từ bảng list_contact qua bảng list
const associations = (listModel) => {
    const model = create();
    _.forEach(listModel, (v) => {
        if (v.name === "list") {
            model.belongsTo(v, {
                as: 'lists',
                foreignKey: 'list_id',
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