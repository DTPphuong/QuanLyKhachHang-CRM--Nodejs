'use strict';
const axios = require('axios');

const {google} = require('googleapis');

const _clientId = '952630846476-ha18o9hu5frko4tqm9pv9rpgkoqt47b9.apps.googleusercontent.com';
const _clientSecret = 'TKsn6ZlvJveFHAEKIgQe2zaA';
const _redirectUrl = 'http://localhost:8000/v1/google/merchant-center/oauthcallback';

const oauth2Client = new google.auth.OAuth2(
    _clientId,
    _clientSecret,
    _redirectUrl
);
google.options({auth: oauth2Client});

const loginUrl = data => {
    const state = data.gmcAccountId;
    // generate a url that asks permissions for Blogger and Google Calendar scopes
    const scopes = [
        'https://www.googleapis.com/auth/content'
    ];

    return oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',
        state: state,
        //response_type: 'code',
        // If you only need one scope you can pass it as a string
        scope: scopes,
        prompt: 'consent',
        login_hint: data.email,
    });
};

const getToken = async (data) => {
    const {tokens} = await oauth2Client.getToken(data.code);
    return tokens;
};

const getAccessToken = async (data) => {
    try {
        await oauth2Client.setCredentials({
            refresh_token: data.refresh_token
        });
        const accessToken = await oauth2Client.getAccessToken();
        return accessToken;
    } catch (e) {
        console.log(e);
        return {
            error: true
        };
    }
};

const getAccountStatus = async (data) => {
    return axios.get(`https://shoppingcontent.googleapis.com/content/v2.1/${data.merchantId}/accountstatuses/${data.accountId}`,{
        headers: { Authorization: `Bearer ${data.token}` }
    });
};

module.exports = {
    loginUrl,
    getToken,
    getAccessToken,
    getAccountStatus
};