'use strict';
const axios = require('axios');
const _ = require('lodash');
const redis = require('redis');
const { update } = require('lodash');
const client = redis.createClient();

const Trim = (s) => {
    if (s) {
        return s.trim();
    } else {
        return '';
    }
};

const p = (url, page) => {

    const u = url.split('?')[1];
    const u2 = u.split('&');
    let t = '';
    _.forEach(u2, (v) => {
        if (v.split('=')[0] === 'page') {
            t += 'page=' + page + '&';
        } else {
            t += v + '&';
        }
    });

    return t.substring(0, t.length - 1);
};

const replaceQuery = (url, query, newValue) => {

    const u = url.split('?')[1];
    const u2 = u.split('&');
    let t = '';
    let i = 0;
    _.forEach(u2, (v) => {
        if (v.split('=')[0] === query) {
            i = 1;
            t += query + '=' + newValue + '&';
        } else {
            t += v + '&';
        }
    });
    if (i === 0) {
        return (t + query + '=' + newValue);
    } else {
        return t.substring(0, t.length - 1);
    }
};

const Paging = (url, totalItem, itemInPage, currentPage) => {
    const pageCount = Math.ceil(totalItem / itemInPage);
    let paging = '';
    for (let i = 1; i <= pageCount; i++) {
        if (parseInt(currentPage) === i) {
            paging += "<a class=\"paginate_button current \">" + i + "</a>";
        } else {
            paging += "<a href='?" + p(url, i) + "' class=\"paginate_button \">" + i + "</a>";
        }
    }
    return paging;
};

const getCodeDomain = (domain) => {
    const ds = domain.split('.');
    let d = '';
    let i = 0;
    _.forEach(ds, (v) => {
        if (i === 1) {
            d = v;
        } else {
            d += '_' + v;
        }
        i++;
    });
    return d.toUpperCase();
};

const Digit = (s) => {
    const v = Math.ceil(s);
    return v.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

// length must > 20
function generateAPIkey(length) {
    let retVal = "";
    const charset = "abcdefghijklmnopqrstuvwxyz";
    const charsetLength = length - 20;
    for (let i = 0, n = charset.length; i < charsetLength; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }

    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const upperLength = 10;
    for (let i = 0, n = upper.length; i < upperLength; ++i) {
        retVal += upper.charAt(Math.floor(Math.random() * n));
    }

    const number = "0123456789";
    const numberLength = 10;
    for (let i = 0, n = number.length; i < numberLength; ++i) {
        retVal += number.charAt(Math.floor(Math.random() * n));
    }

    // const punctuation = "!@#$%^&*()_+~`|}{[]\\:;?><,./-=";
    // const punctuationLenght = 2;
    // for (let i = 0, n = punctuation.length; i < punctuationLenght; ++i) {
    //     retVal += punctuation.charAt(Math.floor(Math.random() * n));
    // }


    return shuffelWord(retVal);
}

function shuffelWord(Word) {
    let shuffledWord = '';
    Word = Word.split('');
    while (Word.length > 0) {
        shuffledWord += Word.splice(Word.length * Math.random() << 0, 1);
    }
    return shuffledWord;
}

const getAccessToken = async(data) => {
    const url = data.protocol + '://' + data.domain + '/wp-json/onweb/v1/generate/token';
    return axios.post(url, {
        private_key_crm: data.website_key,
        user: data.website_user
    });
};

const Url2Domain2 = (url, subDomain = false) => {
    if (url !== undefined) {
        url = url.replace(/(https?:\/\/)?(www.)?/i, '');

        if (subDomain) {
            url = url.split('.');
            url = url.slice(url.length - 2).join('.');
        }

        if (url.indexOf('/') !== -1) {
            return url.split('/')[0];
        }
    } else {
        url = '';
    }

    return url;
};

const removeVietnameseTones = str => {
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "a");
    str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "e");
    str = str.replace(/??|??|???|???|??/g, "i");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "o");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "u");
    str = str.replace(/???|??|???|???|???/g, "y");
    str = str.replace(/??/g, "d");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "A");
    str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "E");
    str = str.replace(/??|??|???|???|??/g, "I");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "O");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "U");
    str = str.replace(/???|??|???|???|???/g, "Y");
    str = str.replace(/??/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // M???t v??i b??? encode coi c??c d???u m??, d???u ch??? nh?? m???t k?? t??? ri??ng bi???t n??n th??m hai d??ng n??y
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ?? ?? ?? ?? ??  huy???n, s???c, ng??, h???i, n???ng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ?? ?? ??  ??, ??, ??, ??, ??
    // Remove extra spaces
    // B??? c??c kho???ng tr???ng li???n nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // B??? d???u c??u, k?? t??? ?????c bi???t
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    return str;
};

const OTPGenerator = length => {
    let result = '';
    let characters = '0123456789';
    let charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

//===========================================
const listFinal = (lists) => {
    const listsFinal = [];
    // t??m parent cao nh???t
    const _parents = lists.filter(f => f.parent_id === null);
    if (_parents) {
        _parents.forEach(i => {
            listsFinal.push({
                id: i.id,
                full_name: i.full_name,
                parent_id: i.parent_id,
                status: i.status,
                created_date: i.created_date
            });
            const _a = listRecursion(lists, i, [], ' - ');
            _a.forEach(j => {
                listsFinal.push(j);
            });
        });
    }
    return listsFinal;
};
// ?????u ti??n, l???y list c?? parent_id l?? null, ????? ?????m b???o l?? c???p cao nh???t (A)
// t??m nh???ng list n??o c?? parent_id l?? ID c???a parent (A)
// result: l?? array nh???ng list ???? ???????c x??? l??
const listRecursion = (lists, parent, result, gach) => {
    const _r = result;
    const _g = gach;

    // t??m childrent
    const _childrent = lists.filter(f => f.parent_id === parent.id);
    _childrent.forEach(i => {
        _r.push({
            id: i.id,
            full_name: _g + i.full_name,
            parent_id: i.parent_id,
            status: i.status,
            created_date: i.created_date
        });
        return listRecursion(lists, i, _r, _g + ' - ');
    });
    return _r;
};
const OTP_comfirm_user = async(data) => {
        //T???o m?? OTP
        const otp = OTPGenerator(6);
        //Luu OTP vao redis
        client.set('otp_' + data, (otp));
        //Show OTP ra 
        client.get('otp_' + data, (err, reply) => {
            if (err) throw err;
            console.log('Ma OTP cua quy khach:', reply);
        });
        //Gioi han OTP trong 60s
        let TTL = client.expire('otp_' + data, 60);
        return TTL;
    }
    // create all obj model database
const createObj = async(obj, data) => {
    return obj.create(data);
};
// find one model by
const findBy = async(obj, data) => {
    return obj.findOne({
        where: data
    });
};
// find all mobile by
const findAllBy = async(obj, data) => {
    return obj.findAll({
        where: data
    });
};

module.exports = {
    Trim,
    Paging,
    replaceQuery,
    getCodeDomain,
    Digit,
    generateAPIkey,
    getAccessToken,
    Url2Domain2,
    removeVietnameseTones,
    OTPGenerator,
    listFinal,
    OTP_comfirm_user,
    createObj,
    findBy,
    findAllBy,
};