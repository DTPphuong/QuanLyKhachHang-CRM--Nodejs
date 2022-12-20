'use strict';
const axios = require('axios');

/*
Author: TaiTran
*/
const check = async (token, ip, secretKey) => {
    return axios.post('https://www.google.com/recaptcha/api/siteverify?secret=' + secretKey + '&response=' + token + '&remoteip=' + ip)
};

module.exports = {
    check
};