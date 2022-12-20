'use strict';
const axios = require('axios');

const url = 'https://api.onweb.asia/0.2.0';

const createWebsite = async (data) => {
    return axios.post(url + '/website/create', {
        domain: data.domain,
        contactProductId: data.contactProductId
    }, {
        headers: { Authorization: `Bearer ${data.token}` }
    });
};
const getVerifyCode = async (data) => {
    return axios.post(url + '/website/post-get-verify-code', {
        domain: data.domain
    });
};
const postRegistry = async (data) => {
    return axios.post(url + '/user/api/register', {
        email: data.email,
        password: data.password,
        fullname: data.fullName,
    });
};
const postResetPassword = async (data) => {
    return axios.post(url + '/user/'+ data.id +'/api/reset-password', {
        password: data.password
    });
};
const getShops = async (data) => {
    return axios.get(url + '/website/'+ data.websiteId +'/shop/get/status/' + data.status);
};
const postShopCreate = async (data) => {
    return axios.post(url + '/website/'+ data.websiteId +'/shop/create', {
        name: data.name,
        address: data.address,
        mobile: data.mobile,
        numberOfStaffs: 0,
        configWorktime: data.configWorktime,
        status: data.status,
    });
};
const postShopUpdate = async (data) => {
    return axios.post(url + '/website/'+ data.websiteId +'/shop/' + data.shopId + '/update', {
        name: data.name,
        address: data.address,
        mobile: data.mobile,
        numberOfStaffs: 0,
        configWorktime: data.configWorktime,
        status: data.status,
    });
};
const customerQuery = async (data) => {
    return axios.post(url + '/customer/api/query', {
        "number_per_page": data.itemInPage,
        "page": data.page,
        "status": data.status,
        "websiteId": data.websiteId
    });
};
const customerUpdate = async (data) => {
    const _d = {};
    if(data.status){
        _d.status = data.status;
    }
    if(data.password){
        _d.password = data.password
    }

    return axios.post(url + '/customer/' + data.customerId + '/api/update', _d);
};
const customerGenBarcode = async (data) => {
    return axios.post(url + '/customer/' + data.customerId + '/so/barcode/gen', {
        "websiteId": data.websiteId
    });
};

module.exports = {
    createWebsite,
    getVerifyCode,
    postRegistry,
    postResetPassword,
    getShops,
    postShopCreate,
    postShopUpdate,
    customerQuery,
    customerUpdate,
    customerGenBarcode
};