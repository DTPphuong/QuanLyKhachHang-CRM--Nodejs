'use strict';
const axios = require('axios');

/*
Author:
*/
const createAccount = async (data) => {

    return axios.get('https://'+data.serverIp+':2087/cpsess'+data.token+'/json-api/createacct?api.version=1' +
        '&username=' + data.username +
        '&domain=' + data.domain +
        //'&bwlimit=unlimited' +
        //'&cgi=1' +
        //'&contactemail=' +
        '&cpmod=paper_lantern' +
        //'&customip=192.0.2.0' +
        //'&featurelist=feature_list' +
        //'&forcedns=0' +
        //'&frontpage=0' +
        //'&gid=123456789' +
        //'&hasshell=0' +
        //'&hasuseregns=1' +
        //'&homedir=/home/user' +
        //'&ip=n' +
        '&language=en' +
        '&owner=root' +
        //'&mailbox_format=mdbox' +
        //'&max_defer_fail_percentage=unlimited' +
        //'&max_email_per_hour=unlimited' +
        //'&max_emailacct_quota=1024' +
        //'&maxaddon=' + data.addonDomain +
        //'&maxftp=' + data.ftp +
        //'&maxlst=unlimited' +
        //'&maxpark=' + data.parkedDomain +
        //'&maxpop=' + data.mailAccount +
        //'&maxsql=' + data.sql +
        //'&maxsub=' + data.subDomain +
        '&mxcheck=local' +
        '&password=' + data.password +
        //'&pkgname=my_new_package' +
        '&plan=' + data.package +
        '&reseller=0' +
        '&savepkg=0' +
        '&spamassassin=1' +
        '&spf=1' +
        '&spambox=y' +
        //'&uid=123456789' +
        //'&useregns=0' +
        ''
    );
};

const DomainList = async (data) => {
    return axios.get('https://'+data.serverIp+':2083/execute/DomainInfo/domains_data', {
        auth: {
            user: 'root',
            password: data.token
        }
    });
};

module.exports = {
    createAccount,
    DomainList
};