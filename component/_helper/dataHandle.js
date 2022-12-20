'use strict';

const HandleSuccess = (res, data, message) => {
    res.status(200).json({
        success: true,
        message: message || 'Request success!',
        data: data
    });
};

const HandleError = (res, statusCode, message, data) => {
    res.status(statusCode).json({
        success: false,
        message: message || 'Request error!',
        data: data || ''
    });
};

module.exports = {
    HandleSuccess,
    HandleError
};