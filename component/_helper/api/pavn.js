'use strict';
const axios = require('axios');

/*
Author: TaiTran
*/
const checkDomain = async (domain) => {

    const userName = 'thacso';
    const apiKey = '6037f589dd5eb094358cfd959682b298';

    return axios.get('https://daily.pavietnam.vn/interface.php?username=' + userName
        + '&apikey=' + apiKey + '&responsetype=json&cmd=check_whois&domain='+domain);
};

module.exports = {
    checkDomain
};