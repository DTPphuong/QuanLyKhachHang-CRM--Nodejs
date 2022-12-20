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
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
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
    // tìm parent cao nhất
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
// đầu tiên, lấy list có parent_id là null, để đảm bảo là cấp cao nhất (A)
// tìm những list nào có parent_id là ID của parent (A)
// result: là array những list đã được xử lý
const listRecursion = (lists, parent, result, gach) => {
    const _r = result;
    const _g = gach;

    // tìm childrent
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
        //Tạo mã OTP
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