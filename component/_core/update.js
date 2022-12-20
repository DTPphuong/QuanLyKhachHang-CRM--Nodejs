'use strict';

const excute = (data, obj) => {
    // const options = {};
    // if(data.invoice_id){
    //     options.invoice_id = data.invoice_id;
    // }
    // if(data.website_key){
    //     options.website_key = data.website_key;
    // }
    // if(data.website_user){
    //     options.website_user = data.website_user;
    // }
    // if(data.code){
    //     options.code = data.code;
    // }
    // if(data.link){
    //     options.link = data.link;
    // }
    // if(data.description){
    //     options.description = data.description;
    // }
    // if(data.lastest_version){
    //     options.lastest_version = data.lastest_version;
    // }
    // if(data.end){
    //     options.end = data.end;
    // }

    return obj.update(data);
};

const tExcute = (data, obj, transaction) => {

    return obj.update(data, {transaction: transaction});
};

const deleteObj = obj => {
    return obj.destroy();
};

module.exports = {
    excute,
    tExcute,
    deleteObj
};