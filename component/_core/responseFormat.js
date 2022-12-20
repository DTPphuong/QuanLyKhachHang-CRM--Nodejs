'use strict'
var ReturnResult = function (code, message, data) {
    this.Result = {
        Error: {
            "Code": code,
            "Message": message
        },
        Data: data
    }

    return this.Result;
}

ReturnResult.SUCCESS_MSG = "Successfull";
ReturnResult.INVAILD_LOGIN = new ReturnResult(-1, "Username or Password is incorrect.", null);
ReturnResult.GET_DATA_FAIL = new ReturnResult(-3, "Cannot get data", null);
ReturnResult.INIT_TOKEN_FAIL = new ReturnResult(-2, "Cannot create token. Please contact Admin", null);
ReturnResult.ADD_TAG_FAIL = new ReturnResult(-4, "Cannot create . Please contact Admin", null);
ReturnResult.INVALID_TOKEN = new ReturnResult(-5, "Invalid token.", null);
ReturnResult.ERROR_MSG = "something wrong";
ReturnResult.ERROR_INPUT_DATA_MSG = "Input data wrong";

module.exports = ReturnResult;